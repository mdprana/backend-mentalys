# API KLinik Documentation

API ini menyediakan informasi tentang tempat-tempat KLinik Kesehatan Mental di lokasi yang ditentukan serta detail informasi untuk tempat tertentu.

## Konfigurasi Lingkungan

Sebelum menjalankan API, pastikan untuk mengatur variabel lingkungan berikut:

| Variabel Lingkungan | Deskripsi | Contoh Nilai |
|---------------------|-----------|--------------|
| `GOOGLE_MAPS_API_KEY` | API Key untuk Google Maps | `apiyangtelahdisediakangoogle` |
| `NODE_ENV` | Mode lingkungan aplikasi | `development` atau `production` |
| `ALLOWED_ORIGINS` | Daftar domain yang diizinkan untuk akses CORS | `http://localhost:3000,https://yourdomain.com` |

## Base URL
```
http://localhost:3000
```

## Endpoints

### 1. Search Places
Mencari tempat-tempat di sekitar lokasi yang ditentukan.

```
GET /api/places/search
```

#### Parameters
| Parameter | Type   | Required | Description                     | Contoh |
|-----------|--------|----------|---------------------------------|--------|
| lat       | number | Yes      | Latitude lokasi | `-6.200000` |
| lng       | number | Yes      | Longitude lokasi | `106.816666` |
| radius    | number | Optional | Radius pencarian dalam meter | `5000` (5 km) |
| openNow   | boolean| Optional | Hanya tampilkan tempat yang sedang buka | `true` |

#### Response Success

```json
{
    "status": "success",
    "data": [
        {
            "business_status": "OPERATIONAL",
            "geometry": {
                "location": {
                    "lat": number,
                    "lng": number
                }
            },
            "name": string,
            "opening_hours": {
                "open_now": boolean
            },
            "rating": number,
            "types": array,
            "vicinity": string,
            "photoUrl": string
        }
    ]
}
```

### 2. Get Place Details
Mendapatkan informasi detail tentang tempat tertentu.

```
GET /api/details/:reference
```

#### Parameters
| Parameter | Type   | Required | Description                |
|-----------|--------|----------|----------------------------|
| reference | string | Yes      | Reference ID dari tempat   |

#### Response Success

```json
{
    "status": "success",
    "data": {
        "formatted_address": string,
        "formatted_phone_number": string,
        "name": string,
        "rating": number,
        "reviews": array,
        "website": string,
        "photoUrl": string
    }
}
```

## Contoh Penggunaan

### Search Places dengan Parameter Tambahan
```bash
curl "http://localhost:3000/api/places/search?lat=-6.200000&lng=106.816666&radius=5000&openNow=true"
```

### Get Place Details
```bash
curl "http://localhost:3000/api/details/ChIJXSPVCc4e4iMR7VLDnvu5U1M"
```

## Catatan Penting
- Semua response akan memiliki format JSON
- Status code 200 akan dikembalikan untuk response sukses
- Pastikan untuk menyertakan parameter yang diperlukan untuk setiap endpoint
- Konfigurasikan variabel lingkungan sebelum menjalankan aplikasi
- Photo URL yang dikembalikan sudah termasuk API key yang diperlukan

## Troubleshooting
- Pastikan `GOOGLE_MAPS_API_KEY` valid dan memiliki izin yang diperlukan
- Untuk mode development, gunakan `NODE_ENV=development`
- Untuk mode production, gunakan `NODE_ENV=production`
- Periksa `ALLOWED_ORIGINS` untuk memastikan domain yang diizinkan sudah benar
