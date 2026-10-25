param(
    [Parameter(Mandatory = $true)]
    [string]$ProjectId,

    [string]$Location = "asia-southeast2"
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command gcloud -ErrorAction SilentlyContinue)) {
    throw "gcloud is not installed or is not on PATH."
}

gcloud config set project $ProjectId
gcloud services enable firestore.googleapis.com --project $ProjectId

$existingDatabase = gcloud firestore databases list `
    --project $ProjectId `
    --format="value(name)" 2>$null | Select-String "/databases/\(default\)"

if ($existingDatabase) {
    Write-Host "Default Firestore database already exists."
    exit 0
}

Write-Host "Creating default Firestore Native database in location '$Location'."
Write-Host "Firestore database location cannot be changed after creation."

gcloud firestore databases create `
    --project $ProjectId `
    --database="(default)" `
    --location=$Location `
    --type=firestore-native
