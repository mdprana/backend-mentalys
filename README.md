# Mentalys Backend

Backend services for [Mentalys](https://github.com/mdprana/mentalys), an Android app for early depression-risk screening. The app combines a PHQ-9 questionnaire with on-device face and voice emotion recognition. The models live in [model-mentalys](https://github.com/mdprana/model-mentalys).

Built for my undergraduate thesis at Universitas Udayana.

Screening inference runs on the phone, so the backend never receives raw face images or voice recordings. It stores only privacy-preserving screening history. It also handles accounts and profiles, educational content, clinic and psychiatrist search, and payments.

## Services

There are four TypeScript + Express services. Each one has its own Dockerfile and is deployed to Google Cloud Run in `asia-southeast2`.

| Folder | Cloud Run service | Responsibility | Main routes |
|---|---|---|---|
| `CLOUD-COMPUTING` | `mentalys-main-api` | Firebase Auth, user profile, screening history, psychiatrist data, Midtrans payments, Swagger docs | `/api/auth`, `/api/user`, `/api/ml/history`, `/api/psychiatrists`, `/api/midtrans` |
| `API-Artikel-dan-Makanan` | `mentalys-article-food-api` | Mental-health articles and food recommendations stored in Firestore (Mentalys Pedia) | `/api/v1/article`, `/api/v1/food` |
| `API-Klinik-Terdekat` | `mentalys-clinic-api` | Nearby clinic search through Google Places | `/api/places/search`, `/api/places/details/:placeId` |
| `Api-Contact-Psikiaters` | `mentalys-psychiatrist-api` | Psychiatrist contact lookup through Google Places | `/api/google-maps/psychiatrists`, `/api/google-maps/psychiatrist/:placeId` |

`scripts/` contains `deploy-cloud-run.ps1`, which checks billing, enables APIs, creates Secret Manager secrets, grants IAM and deploys all four services. It also contains `setup-firestore.ps1`.

## Tech stack

TypeScript 5, Node.js, Express 4, Firebase Admin SDK (Auth + Firestore), Google Maps Services, Midtrans, Docker, Google Cloud Run, Secret Manager.

## Running locally

```bash
cd CLOUD-COMPUTING          # or any other service folder
cp .env.example .env        # fill in your own values
npm install
npm run build && npm start
```

The Firebase service account, Google Maps key and Midtrans server key are read from environment variables or Secret Manager. They are not stored in this repository. See [DEPLOYMENT.md](DEPLOYMENT.md) for the full Google Cloud and Firebase setup and [CONTENT_MANAGEMENT.md](CONTENT_MANAGEMENT.md) for managing article and food content. Run `npm run seed:content` in `API-Artikel-dan-Makanan` to seed Firestore.

Deploy all services from Windows PowerShell:

```powershell
.\scripts\deploy-cloud-run.ps1 -ProjectId <your-project-id> -Region asia-southeast2
```

## Credits

The services started as the backend of the Mentalys capstone team (Mentalys-App). Their original commit history is preserved here under each folder. I extended them for the thesis by moving screening to on-device inference, adding the `/ml/history` storage API with face and multimodal types, Midtrans payment fixes, Firestore content seeding, and Cloud Run deployment automation.

Maintained by Made Pranajaya Dibyacita.
