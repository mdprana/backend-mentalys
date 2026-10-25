# Mentalys Google Cloud + Firebase Deployment

## Current Blockers

- `gcloud` is not installed or not on `PATH`.
- `firebase` CLI is not installed or not on `PATH`.
- Docker Desktop is installed, but the Docker daemon is not running.
- Fill the generated `.env` files with your real local values before running services locally. Do not commit real secrets.

## Recommended Target

Deploy the four backend APIs to Cloud Run:

- `mentalys-main-api`
- `mentalys-clinic-api`
- `mentalys-psychiatrist-api`
- `mentalys-article-food-api`

Cloud Run is a good fit because each backend already has a Dockerfile and listens on `process.env.PORT` when Cloud Run provides `PORT=8080`.

## One-Time Google Cloud Setup

Install Google Cloud CLI, then authenticate:

```powershell
gcloud auth login
gcloud auth application-default login
gcloud config set project YOUR_PROJECT_ID
```

Enable required APIs:

```powershell
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com secretmanager.googleapis.com firestore.googleapis.com identitytoolkit.googleapis.com
```

Create the default Firestore database once. The location cannot be changed after creation:

```powershell
.\scripts\setup-firestore.ps1 -ProjectId YOUR_PROJECT_ID -Location asia-southeast2
```

Create required secrets in Secret Manager. Use your real values:

```powershell
gcloud secrets create firebase-service-account --replication-policy=automatic --data-file=path\to\firebase-service-account.json
gcloud secrets create google-maps-api-key --replication-policy=automatic --data-file=path\to\google-maps-api-key.txt
gcloud secrets create midtrans-server-key --replication-policy=automatic --data-file=path\to\midtrans-server-key.txt
```

The deploy script automatically loads Firebase values from `google-services.json` when they are not already set in PowerShell. You only need to set them manually if you want to override the detected values:

```powershell
$env:FIREBASE_API_KEY="..."
$env:FIREBASE_AUTH_DOMAIN="..."
$env:FIREBASE_PROJECT_ID="..."
$env:FIREBASE_STORAGE_BUCKET="..."
$env:FIREBASE_MESSAGING_SENDER_ID="..."
$env:FIREBASE_APP_ID="..."
$env:FIREBASE_BUCKET_IMAGE="..."
$env:FIREBASE_DATABASE_URL="..."
```

External ML model URLs are optional now. The Android app runs screening inference on-device and the backend stores only metadata through `/api/ml/history`. Set `QUIZ_MODEL_API_URL`, `AUDIO_MODEL_API_URL`, or `HANDWRITING_MODEL_API_URL` only if you intentionally need the legacy server-side ML endpoints.

Grant the Cloud Run runtime service account access to secrets:

```powershell
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" --role="roles/secretmanager.secretAccessor"
```

## Firebase Google Auth Setup

In Firebase Console:

1. Open Authentication.
2. Open Sign-in method.
3. Enable Google provider.
4. Add the Android app package name: `com.mentalys.app`.
5. Add the app SHA-1 and SHA-256 fingerprints.
6. Download `google-services.json` if the Android app is migrated to Firebase Android SDK based Google Sign-In.

The current Android app only has email/password auth wired in the UI. Google provider enablement is necessary but not sufficient for a visible Google login button; the app still needs a Google Sign-In client flow if that user-facing feature is required.

## Deploy

From `D:\1. Skripsi\backend`:

```powershell
.\scripts\deploy-cloud-run.ps1 -ProjectId YOUR_PROJECT_ID -Region asia-southeast2
```

Current Cloud Run URLs for Android `local.properties`:

```properties
BASE_URL_MAIN=https://mentalys-main-api-204727888032.asia-southeast2.run.app/api/
BASE_URL_CLINIC=https://mentalys-clinic-api-204727888032.asia-southeast2.run.app/
BASE_URL_PSYCHIATRIST=https://mentalys-psychiatrist-api-204727888032.asia-southeast2.run.app/api/
BASE_URL_ARTICLES=https://mentalys-article-food-api-204727888032.asia-southeast2.run.app/api/v1/
```

Then rebuild Android:

```powershell
cd D:\1. Skripsi\app
.\gradlew.bat :app:assembleDebug
```
