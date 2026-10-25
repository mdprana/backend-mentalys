param(
    [Parameter(Mandatory = $true)]
    [string]$ProjectId,

    [string]$Region = "asia-southeast2",
    [switch]$AllowUnauthenticated = $true,
    [switch]$UpdateSecrets
)

$ErrorActionPreference = "Stop"

function Assert-Command($Name) {
    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "$Name is not installed or is not on PATH. Install Google Cloud CLI, run gcloud auth login, then rerun this script."
    }
}

function Assert-BillingEnabled($ProjectId) {
    $billingEnabled = & gcloud billing projects describe $ProjectId --format="value(billingEnabled)" 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "Could not verify billing for project '$ProjectId'. Make sure you are logged in and have permission to view Cloud Billing for this project."
    }

    if ($billingEnabled -ne "True") {
        throw "Billing is not enabled for project '$ProjectId'. Link the project to your active Google Cloud free-trial billing account, then rerun this script."
    }
}

function Get-ProjectNumber($ProjectId) {
    $projectNumber = & gcloud projects describe $ProjectId --format="value(projectNumber)"
    if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($projectNumber)) {
        throw "Could not resolve project number for project '$ProjectId'."
    }

    return $projectNumber.Trim()
}

function Grant-RuntimeSecretAccess($ProjectId) {
    $projectNumber = Get-ProjectNumber $ProjectId
    $runtimeServiceAccount = "$projectNumber-compute@developer.gserviceaccount.com"
    $member = "serviceAccount:$runtimeServiceAccount"

    Write-Host "Granting Secret Manager access to Cloud Run runtime service account: $runtimeServiceAccount"
    & gcloud projects add-iam-policy-binding $ProjectId `
        --member=$member `
        --role="roles/secretmanager.secretAccessor" `
        --quiet | Out-Null

    if ($LASTEXITCODE -ne 0) {
        throw "Could not grant Secret Manager access to '$runtimeServiceAccount'. Grant roles/secretmanager.secretAccessor manually, then rerun this script."
    }
}

function Ensure-SecretFromFile($SecretName, $FilePath, [switch]$AddVersionIfExists) {
    if (-not (Test-Path $FilePath)) {
        throw "Secret '$SecretName' is required, but local file '$FilePath' was not found."
    }

    & gcloud secrets describe $SecretName --format="value(name)" 2>$null | Out-Null
    if ($LASTEXITCODE -eq 0) {
        if ($AddVersionIfExists) {
            Write-Host "Adding new Secret Manager version: $SecretName"
            & gcloud secrets versions add $SecretName `
                --data-file=$FilePath | Out-Null

            if ($LASTEXITCODE -ne 0) {
                throw "Could not add a new version for Secret Manager secret '$SecretName'."
            }
        }
        return
    }

    Write-Host "Creating Secret Manager secret: $SecretName"
    & gcloud secrets create $SecretName `
        --replication-policy="automatic" `
        --data-file=$FilePath | Out-Null

    if ($LASTEXITCODE -ne 0) {
        throw "Could not create Secret Manager secret '$SecretName'."
    }
}

function Ensure-RequiredSecrets {
    $firebaseServiceAccountFile = Get-ChildItem -Path (Get-Location) -Filter "*firebase-adminsdk*.json" |
        Select-Object -First 1

    if (-not $firebaseServiceAccountFile) {
        throw "Could not find a Firebase Admin SDK JSON file matching '*firebase-adminsdk*.json'."
    }

    Ensure-SecretFromFile "firebase-service-account" $firebaseServiceAccountFile.FullName
    Ensure-SecretFromFile "google-maps-api-key" (Join-Path (Get-Location) "google-maps-api-key.txt")
    Ensure-SecretFromFile "midtrans-server-key" (Join-Path (Get-Location) "midtrans-server-key.txt") -AddVersionIfExists:$UpdateSecrets
}

function Get-RequiredEnv($Name) {
    $value = [Environment]::GetEnvironmentVariable($Name)
    if ([string]::IsNullOrWhiteSpace($value)) {
        throw "Missing required environment variable: $Name"
    }
    return $value
}

function Add-OptionalEnv($Items, $Name) {
    $value = [Environment]::GetEnvironmentVariable($Name)
    if (-not [string]::IsNullOrWhiteSpace($value)) {
        $Items.Add("$Name=$value") | Out-Null
    }
}

function Set-EnvIfMissing($Name, $Value) {
    $currentValue = [Environment]::GetEnvironmentVariable($Name)
    if ([string]::IsNullOrWhiteSpace($currentValue) -and -not [string]::IsNullOrWhiteSpace($Value)) {
        [Environment]::SetEnvironmentVariable($Name, $Value, "Process")
    }
}

function Load-FirebaseEnvFromGoogleServices {
    $googleServicesPath = Join-Path (Get-Location) "google-services.json"
    if (-not (Test-Path $googleServicesPath)) {
        return
    }

    $googleServices = Get-Content -Raw $googleServicesPath | ConvertFrom-Json
    $client = $googleServices.client[0]
    $projectId = $googleServices.project_info.project_id
    $storageBucket = $googleServices.project_info.storage_bucket

    Set-EnvIfMissing "FIREBASE_API_KEY" $client.api_key[0].current_key
    Set-EnvIfMissing "FIREBASE_AUTH_DOMAIN" "$projectId.firebaseapp.com"
    Set-EnvIfMissing "FIREBASE_PROJECT_ID" $projectId
    Set-EnvIfMissing "FIREBASE_STORAGE_BUCKET" $storageBucket
    Set-EnvIfMissing "FIREBASE_MESSAGING_SENDER_ID" $googleServices.project_info.project_number
    Set-EnvIfMissing "FIREBASE_APP_ID" $client.client_info.mobilesdk_app_id
    Set-EnvIfMissing "FIREBASE_BUCKET_IMAGE" "gs://$storageBucket"
    Set-EnvIfMissing "FIREBASE_DATABASE_URL" "https://$projectId-default-rtdb.firebaseio.com"
}

function Deploy-Service($Name, $Path, $EnvVars, $Secrets = "") {
    Write-Host "Deploying Cloud Run service: $Name from $Path"
    Push-Location $Path
    try {
        $authFlag = if ($AllowUnauthenticated) { "--allow-unauthenticated" } else { "--no-allow-unauthenticated" }
        $args = @(
            "run", "deploy", $Name,
            "--project", $ProjectId,
            "--region", $Region,
            "--source", ".",
            "--platform", "managed",
            "--set-env-vars", $EnvVars,
            $authFlag,
            "--quiet"
        )
        if (-not [string]::IsNullOrWhiteSpace($Secrets)) {
            $args += @("--set-secrets", $Secrets)
        }
        & gcloud @args
        if ($LASTEXITCODE -ne 0) {
            throw "Cloud Run deploy failed for service '$Name'."
        }
        Write-Host "Finished Cloud Run service: $Name"
    } finally {
        Pop-Location
    }
}

Load-FirebaseEnvFromGoogleServices
Assert-Command "gcloud"

$firebaseEnvItems = [System.Collections.Generic.List[string]]::new()
@(
    "NODE_ENV=production",
    "PROJECT_ID=$ProjectId",
    "SECRET_ID=firebase-service-account",
    "SECRET_VERSION=latest",
    "FIREBASE_API_KEY=$(Get-RequiredEnv 'FIREBASE_API_KEY')",
    "FIREBASE_AUTH_DOMAIN=$(Get-RequiredEnv 'FIREBASE_AUTH_DOMAIN')",
    "FIREBASE_PROJECT_ID=$(Get-RequiredEnv 'FIREBASE_PROJECT_ID')",
    "FIREBASE_STORAGE_BUCKET=$(Get-RequiredEnv 'FIREBASE_STORAGE_BUCKET')",
    "FIREBASE_MESSAGING_SENDER_ID=$(Get-RequiredEnv 'FIREBASE_MESSAGING_SENDER_ID')",
    "FIREBASE_APP_ID=$(Get-RequiredEnv 'FIREBASE_APP_ID')",
    "FIREBASE_BUCKET_IMAGE=$(Get-RequiredEnv 'FIREBASE_BUCKET_IMAGE')",
    "FIREBASE_DATABASE_URL=$(Get-RequiredEnv 'FIREBASE_DATABASE_URL')"
) | ForEach-Object { $firebaseEnvItems.Add($_) | Out-Null }

Add-OptionalEnv $firebaseEnvItems "QUIZ_MODEL_API_URL"
Add-OptionalEnv $firebaseEnvItems "AUDIO_MODEL_API_URL"
Add-OptionalEnv $firebaseEnvItems "HANDWRITING_MODEL_API_URL"

$firebaseEnv = $firebaseEnvItems -join ","

gcloud config set project $ProjectId
Assert-BillingEnabled $ProjectId
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com secretmanager.googleapis.com firestore.googleapis.com
Ensure-RequiredSecrets
Grant-RuntimeSecretAccess $ProjectId

Deploy-Service "mentalys-main-api" "CLOUD-COMPUTING" $firebaseEnv "MIDTRANS_SERVER_KEY=midtrans-server-key:latest"
Deploy-Service "mentalys-clinic-api" "API-Klinik-Terdekat" "NODE_ENV=production,ALLOWED_ORIGINS=*" "GOOGLE_MAPS_API_KEY=google-maps-api-key:latest"
Deploy-Service "mentalys-psychiatrist-api" "Api-Contact-Psikiaters" "NODE_ENV=production" "GOOGLE_MAPS_API_KEY=google-maps-api-key:latest"
Deploy-Service "mentalys-article-food-api" "API-Artikel-dan-Makanan" "NODE_ENV=production,PROJECT_ID=$ProjectId"
