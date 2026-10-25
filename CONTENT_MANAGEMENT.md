# Mentalys Content Management

Use Firestore as the source of truth for article and food content. The Android app only displays records returned by the Article/Food API.

## Option 1: Firebase Console

1. Open Firebase Console.
2. Select project `skripsi-89586`.
3. Open Firestore Database.
4. Add documents to `articles` or `foods`.

Article documents should use this shape:

```json
{
  "id": "depression-basics",
  "title": "Understanding Depression Screening Results",
  "author": {
    "id": "mentalys-editorial",
    "name": "Mentalys Editorial Team",
    "profile_image": "https://example.com/author.jpg",
    "bio": "Prepared from public health guidance and reviewed by a licensed professional."
  },
  "metadata": {
    "publish_date": "2026-04-25T00:00:00.000Z",
    "last_updated": "2026-04-25T00:00:00.000Z",
    "tags": ["depression", "screening"],
    "category": "Mental Health Education",
    "reading_time": 4,
    "likes": 0,
    "views": 0,
    "mental_state": "depression",
    "image_link": "https://example.com/article.jpg",
    "short_description": "Short preview text for the Android article list.",
    "medical_disclaimer": "Educational content only. It does not replace diagnosis or treatment.",
    "references": [
      {
        "title": "Depression",
        "source": "National Institute of Mental Health",
        "url": "https://www.nimh.nih.gov/health/topics/depression",
        "year": 2024
      }
    ],
    "reviewed_by": {
      "name": "Reviewer Name",
      "role": "Psychologist / Psychiatrist / Physician",
      "organization": "Clinic or University",
      "reviewed_at": "2026-04-25T00:00:00.000Z"
    }
  },
  "content": [
    {
      "type": "paragraph",
      "text": "Article paragraph text."
    },
    {
      "type": "list",
      "style": "bullet",
      "items": ["Point one", "Point two"]
    }
  ]
}
```

Food documents should use this shape:

```json
{
  "id": "oatmeal-banana",
  "name": "Oatmeal with Banana",
  "description": "Whole grains and fruit fit healthy-diet guidance.",
  "category": "Breakfast",
  "imageUrl": "https://example.com/food.jpg",
  "evidenceNote": "Based on WHO healthy-diet guidance.",
  "references": [
    {
      "title": "Healthy diet",
      "source": "World Health Organization",
      "url": "https://www.who.int/news-room/fact-sheets/detail/healthy-diet",
      "year": 2026
    }
  ],
  "reviewedBy": {
    "name": "Reviewer Name",
    "role": "Registered Dietitian / Physician",
    "organization": "Clinic or University",
    "reviewedAt": "2026-04-25T00:00:00.000Z"
  }
}
```

## Option 2: API

Use the deployed API when you want validation:

```powershell
Invoke-RestMethod -Method Post `
  -Uri "https://mentalys-article-food-api-204727888032.asia-southeast2.run.app/api/v1/article" `
  -ContentType "application/json" `
  -Body (Get-Content .\article.json -Raw)
```

```powershell
Invoke-RestMethod -Method Post `
  -Uri "https://mentalys-article-food-api-204727888032.asia-southeast2.run.app/api/v1/food" `
  -ContentType "application/json" `
  -Body (Get-Content .\food.json -Raw)
```

## Option 3: Code Seed

Edit:

```text
API-Artikel-dan-Makanan/src/scripts/seedFirestore.ts
```

Then run:

```powershell
cd "D:\1. Skripsi\backend\API-Artikel-dan-Makanan"
npm run seed:content
```

The seed script upserts records by document ID. It does not delete existing content.

## Content Quality Rules

- Do not present screening results as diagnosis.
- Do not claim food can cure depression.
- Use public-health guidance or peer-reviewed research as references.
- Add a named reviewer before final thesis/demo publication.
- Prefer images hosted in Firebase Storage or another stable HTTPS source.
- Keep raw PHQ-9 item answers, face images, and voice recordings out of article/food content and logs.
