<div align="center">

# MENTALYS API
### Mental Health Analysis API Solution

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Google Cloud](https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)

</div>

## Introduction

Mentalys API is a comprehensive solution designed for mental health analysis through multiple approaches. Built with TypeScript and Express.js, this API integrates machine learning models to process questionnaires, audio samples, and handwriting analysis, providing valuable mental health insights.

## Technology Stack

- **Backend**: Express.js with TypeScript
- **Authentication**: Firebase Authentication
- **Database**: Cloud Firestore
- **Cloud Services**: Google Cloud Platform
- **ML Models**: Python-based analysis tools

## API Endpoints

```
Development: http://localhost:3000/api
```

### Documentation
For complete API documentation, visit Swagger UI:
```
Development: http://localhost:3000/api-docs
```

or Download this full documentation: [Download Rest API Documentation](https://github.com/user-attachments/files/18095767/mentalys.doc.pdf)

### Core Features

| Feature | Description |
|---------|-------------|
| Mental Health Quiz | Comprehensive questionnaire analysis for mental health assessment |
| Voice Analysis | Advanced voice pattern analysis for mental state detection |
| Handwriting Analysis | Sophisticated handwriting analysis for personality insights |
| History Tracking | Detailed tracking of analysis history |
| User Management | Secure Firebase-based authentication and profile system |

### Main Endpoints

```bash
### Authentication
| Method | Endpoint              | Description               |
|--------|-----------------------|---------------------------|
| POST   | `/auth/register`      | User Registration         |
| POST   | `/auth/login`         | User Login                |
| POST   | `/auth/reset-password`| Password Reset Request    |

### Profile Management
| Method | Endpoint              | Description               |
|--------|-----------------------|---------------------------|
| PUT    | `/user`               | Update User Profile       |
| GET    | `/user`               | Get User Profile          |
| POST   | `/signout`            | Log Out User              |

### Machine Learning
| Method | Endpoint              | Description                        |
|--------|-----------------------|------------------------------------|
| POST   | `/ml/quiz`            | Submit Quiz Data for Analysis      |
| POST   | `/ml/audio`           | Upload Audio for Prediction        |
| POST   | `/ml/handwriting`     | Upload Handwriting for Prediction  |

### Machine Learning History
| Method | Endpoint              | Description                                |
|--------|-----------------------|--------------------------------------------|
| GET    | `/ml/history`         | Retrieve Machine Learning Request History  |
| GET    | `/ml/all-history`     | Retrieve All Machine Learning Requests     |

### Contact Psikiater
| Method | Endpoint                | Description                                |
|--------|-------------------------|--------------------------------------------|
| GET    | `/api/psychiatrists`    | Retrieve psychiatrists list                |
| GET    | `/api/psychiatrists/:id`| Retrieve psychiatrists details             |

### Midtrans Implementation
| Method | Endpoint                | Description                                |
|--------|-------------------------|--------------------------------------------|
| POST   | `/api/midtrans/charge`  | Midtrans Payment Request                   |
```

## Security

- Firebase Authentication
- Secure file uploads
- Data encryption

## Installation Guide

1. Clone repository
```bash
git clone https://github.com/Mentalys-App/CLOUD-COMPUTING.git
```

2. Install dependencies
```bash
npm install
```

3. Configure environment
```bash
cp .env.example .env
# Configure your Firebase and GCP credentials in .env
```

4. Start development server
```bash
npm run dev
```

## License

Copyright © 2024 Mentalys

This project is licensed under the MIT License.
