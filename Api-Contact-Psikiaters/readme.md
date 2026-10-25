# API Contact Psi - Documentation

This repository provides the API for accessing **Psychiatrist Contact Data** through the Google Maps API and other external sources. The API allows users to retrieve information about psychiatrists, including names, addresses, ratings, contact numbers, and more.

## Features

- Retrieve data on psychiatrists near a specified location.
- Get details such as ratings, addresses, phone numbers, and more.
- Use Google Places API for data retrieval.

## API Documentation

[Dokumentasi](https://documenter.getpostman.com/view/29351832/2sAYBaAVdh)

## Base URL
http://localhost:3000/api


---

## Endpoints

### 1. Get All Psychiatrists
**Description**: Fetches a list of psychiatrists near a specified location.  
**Method**: `GET`  
**Endpoint**: `{{URL}}/api/google-maps/psychiatrists`

#### Request Parameters
| Parameter  | Type   | Required | Description                          |
|------------|--------|----------|--------------------------------------|
| `location` | String | Yes      | The latitude and longitude (e.g., `-6.200000,106.816666`). |
| `radius`   | Number | Yes      | Radius in meters to search within.  |

#### Sample Request
GET {{URL}}/api/google-maps/psychiatrists?location=-6.200000,106.816666&radius=5000


#### Sample Response
```json
[
  {
    "placeId": "ChIJN1t_tDeuEmsRUsoyG83frY4",
    "name": "Psychiatrist ABC Clinic",
    "address": "123 Main St, City Name",
    "rating": 4.5,
    "userRatingsTotal": 120,
    "location": {
      "lat": -6.200000,
      "lng": 106.816666
    },
    "phoneNumber": "+62-21-12345678",
    "website": "https://example.com",
    "openingHours": [
      "Monday: 9:00 AM – 5:00 PM",
      "Tuesday: 9:00 AM – 5:00 PM"
    ],
    "photoUrl": "https://maps.googleapis.com/.../photo_reference"
  }
]
```


### 2. Get Psychiatrist by Place ID
**Description**: Fetches a list of psychiatrists near a specified location.  
**Method**: `GET`  
**Endpoint**: `{{URL}}/api/google-maps/psychiatrist/:placeId`

#### Sample Request
GET {{URL}}/api/google-maps/psychiatrist/ChIJN1t_tDeuEmsRUsoyG83frY4

#### Sample Response
```json
{
  "placeId": "ChIJN1t_tDeuEmsRUsoyG83frY4",
  "name": "Psychiatrist ABC Clinic",
  "address": "123 Main St, City Name",
  "rating": 4.5,
  "userRatingsTotal": 120,
  "location": {
    "lat": -6.200000,
    "lng": 106.816666
  },
  "phoneNumber": "+62-21-12345678",
  "website": "https://example.com",
  "openingHours": [
    "Monday: 9:00 AM – 5:00 PM",
    "Tuesday: 9:00 AM – 5:00 PM"
  ],
  "photoUrl": "https://maps.googleapis.com/.../photo_reference"
}


```


