# Article and Food Libary Management API Documentation

## Base URL
All endpoints can be accessed at the following base URL:
```
http://localhost:3000/api/v1
```
## Environment Variables
To run this project, add the following environment variables to your `.env` file:

- `PORT`: Server port (default: 3000).
- `NODE_ENV`: development or production.
# Dokumentasi API Artikel Rekomendasi
## Endpoints

### 1. Create Article
- **URL**: `/article`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "title": "Article Title",
    "author": {
      "name": "Author Name",
      "id": "Author ID",
      "profile_image": "Profile Image URL",
      "bio": "Author Bio"
    },
    "metadata": {
      "publish_date": "2024-11-06T00:00:00Z",
      "last_updated": "2024-11-06T00:00:00Z",
      "tags": ["tag1", "tag2"],
      "category": "Article Category",
      "reading_time": 5,
      "likes": 0,
      "views": 0,
      "mental_state": "anxiety",
      "image_link": "https://example.com/image.jpg"
    },
    "content": [
      {
        "type": "header",
        "level": 1,
        "text": "Header Content"
      },
      {
        "type": "paragraph",
        "text": "Paragraph content."
      }
    ]
  }
  ```
- **Response**:
  ```json
  {
    "id": "Article ID",
    "message": "Article created successfully"
  }
  ```
- **Error Response**:
  - `400 Bad Request`: If any required field is missing or invalid.

### 2. Get All Articles
- **URL**: `/article`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "message": "Articles retrieved successfully",
    "data": {
      "count": 2,
      "articles": [
        {
          "id": "Article ID",
          "title": "Article Title",
          "metadata": {
            "publish_date": "2024-11-06T00:00:00Z",
            "last_updated": "2024-11-06T00:00:00Z",
            "tags": ["tag1", "tag2"],
            "category": "Article Category",
            "reading_time": 5,
            "likes": 0,
            "views": 0
          }
        }
      ]
    }
  }
  ```

### 3. Get Article by ID
- **URL**: `/article/:id`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "message": "Article retrieved successfully",
    "data": {
      "id": "Article ID",
      "title": "Article Title",
      "author": {
        "name": "Author Name",
        "id": "Author ID",
        "profile_image": "Profile Image URL",
        "bio": "Author Bio"
      },
      "metadata": {
        "publish_date": "2024-11-06T00:00:00Z",
        "last_updated": "2024-11-06T00:00:00Z",
        "tags": ["tag1", "tag2"],
        "category": "Article Category",
        "reading_time": 5,
        "likes": 0,
        "views": 0,
        "mental_state": "anxiety",
        "image_link": "https://example.com/image.jpg"
      },
      "content": [
        {
          "type": "header",
          "level": 1,
          "text": "Header Content"
        },
        {
          "type": "paragraph",
          "text": "Paragraph content."
        }
      ]
    }
  }
  ```
- **Error Response**:
  - `404 Not Found`: If the article with the given ID is not found.

### 4. Delete Article
- **URL**: `/article/:id`
- **Method**: `DELETE`
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Article deleted successfully"
  }
  ```
- **Error Response**:
  - `404 Not Found`: If the article with the given ID is not found.
### 5. Get Articles by Mental State
- **URL**: `/article/mental_state/:mental_state`
- **Method**: `GET`
- **URL Parameters**:
  - `mental_state`: The mental state to filter articles by. Must be one of the predefined mental states (e.g., "anxiety", "MDD", "PTSD", etc.).

- **Response**:
  ```json
  {
    "message": "Articles retrieved successfully",
    "data": {
      "count": 2,
      "articles": [
        {
          "id": "Article ID",
          "title": "Article Title",
          "metadata": {
            "publish_date": "2024-11-06T00:00:00Z",
            "last_updated": "2024-11-06T00:00:00Z",
            "tags": ["tag1", "tag2"],
            "category": "Article Category",
            "reading_time": 5,
            "likes": 0,
            "views": 0
          }
        }
      ]
    }
  }
- **Error Response**:
  - `404 Not Found`: If the article with the given ID is not found.

## Usage Example

### Create Article
```bash
curl -X POST http://localhost:3000/api/v1/article \
-H "Content-Type: application/json" \
-d '{
  "title": "Article Title",
  "author": {
    "name": "Author Name",
    "id": "Author ID",
    "profile_image": "Profile Image URL",
    "bio": "Author Bio"
  },
  "metadata": {
    "publish_date": "2024-11-06T00:00:00Z",
    "last_updated": "2024-11-06T00:00:00Z",
    "tags": ["tag1", "tag2"],
    "category": "Article Category",
    "reading_time": 5,
    "likes": 0,
    "views": 0,
    "mental_state": "anxiety",
    "image_link": "https://example.com/image.jpg"
  },
  "content": [
    {
      "type": "header",
      "level": 1,
      "text": "Header Content"
    },
    {
      "type": "paragraph",
      "text": "Paragraph content."
    }
  ]
}'
```

### Get All Articles
```bash
curl -X GET http://localhost:3000/api/v1/article
```

### Get Article by ID
```bash
curl -X GET http://localhost:3000/api/v1/article/ARTICLE_ID
```

### Delete Article
```bash
curl -X DELETE http://localhost:3000/api/v1/article/ARTICLE_ID
```
### Get Articles by Mental State
```bash
curl -X GET http://localhost:3000/api/v1/article/mental_state/anxiety
```
# Dokumentasi API Library Makanan

## Endpoint

### 1. Membuat Makanan
- **URL**: `/food`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "name": "Nama Makanan",
    "description": "Deskripsi Makanan",
    "category": "Kategori Makanan",
    "imageUrl": "https://example.com/image.jpg"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Food created successfully",
    "data": {
      "id": "ID Makanan",
      "name": "Nama Makanan",
      "description": "Deskripsi Makanan",
      "category": "Kategori Makanan",
      "imageUrl": "https://example.com/image.jpg"
    }
  }
  ```
- **Error Response**:
  - `400 Bad Request`: Jika ada field yang hilang atau tidak valid.

### 2. Mengambil Semua Makanan
- **URL**: `/food`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "message": "Foods retrieved successfully",
    "data": [
      {
        "id": "ID Makanan",
        "name": "Nama Makanan",
        "description": "Deskripsi Makanan",
        "category": "Kategori Makanan",
        "imageUrl": "https://example.com/image.jpg"
      },
      {
        "id": "ID Makanan 2",
        "name": "Nama Makanan 2",
        "description": "Deskripsi Makanan 2",
        "category": "Kategori Makanan 2",
        "imageUrl": "https://example.com/image2.jpg"
      }
    ]
  }
  ```

### 3. Mengambil Makanan Berdasarkan ID
- **URL**: `/food/:id`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "message": "Food retrieved successfully",
    "data": {
      "id": "ID Makanan",
      "name": "Nama Makanan",
      "description": "Deskripsi Makanan",
      "category": "Kategori Makanan",
      "imageUrl": "https://example.com/image.jpg"
    }
  }
  ```
- **Error Response**:
  - `404 Not Found`: Jika makanan dengan ID yang diberikan tidak ditemukan.

### 4. Memperbarui Makanan
- **URL**: `/food/:id`
- **Method**: `PUT`
- **Request Body**:
  ```json
  {
    "name": "Nama Makanan Baru",
    "description": "Deskripsi Makanan Baru",
    "category": "Kategori Makanan Baru",
    "imageUrl": "https://example.com/image-baru.jpg"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Food updated successfully",
    "data": {
      "id": "ID Makanan",
      "name": "Nama Makanan Baru",
      "description": "Deskripsi Makanan Baru",
      "category": "Kategori Makanan Baru",
      "imageUrl": "https://example.com/image-baru.jpg"
    }
  }
  ```
- **Error Response**:
  - `404 Not Found`: Jika makanan dengan ID yang diberikan tidak ditemukan.
  - `400 Bad Request`: Jika ada field yang tidak valid.

### 5. Menghapus Makanan
- **URL**: `/food/:id`
- **Method**: `DELETE`
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Food deleted successfully"
  }
  ```
- **Error Response**:
  - `404 Not Found`: Jika makanan dengan ID yang diberikan tidak ditemukan.

## Contoh Penggunaan

Berikut adalah contoh penggunaan API menggunakan `curl`:

### Membuat Makanan
```bash
curl -X POST http://localhost:3000/api/v1/food \
-H "Content-Type: application/json" \
-d '{
  "name": "Nama Makanan",
  "description": "Deskripsi Makanan",
  "category": "Kategori Makanan",
  "imageUrl": "https://example.com/image.jpg"
}'
```

### Mengambil Semua Makanan
```bash
curl -X GET http://localhost:3000/api/v1/food
```

### Mengambil Makanan Berdasarkan ID
```bash
curl -X GET http://localhost:3000/api/v1/food/ID_MAKANAN
```

### Memperbarui Makanan
```bash
curl -X PUT http://localhost:3000/api/v1/food/ID_MAKANAN \
-H "Content-Type: application/json" \
-d '{
  "name": "Nama Makanan Baru",
  "description": "Deskripsi Makanan Baru",
  "category": "Kategori Makanan Baru",
  "imageUrl": "https://example.com/image-baru.jpg"
}'
```

### Menghapus Makanan
```bash
curl -X DELETE http://localhost:3000/api/v1/food/ID_MAKANAN
```
