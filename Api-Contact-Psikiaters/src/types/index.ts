export interface Location {
  lat: number
  lng: number
}

export interface SearchParams {
  location: Location
  radius: number
  openNow?: boolean
  keyword?: string
}

export interface PlacePhoto {
  photo_reference: string
  height: number
  width: number
  html_attributions: string[]
}

export interface PlaceDetails {
  name: string
  formatted_address?: string
  formatted_phone_number?: string
  rating?: number
  user_ratings_total?: number // Tambahkan jumlah rating pengguna
  opening_hours?: {
    open_now: boolean
    weekday_text?: string[]
  }
  geometry: {
    location: Location
  }
  photos?: PlacePhoto[]
  photoUrl?: string // URL foto tempat (jika ada)
  website?: string // Website tempat (jika ada)
}

export interface Psychiatrist {
  placeId: string
  name: string
  address?: string
  rating?: string | number
  userRatingsTotal?: string | number
  location: Location
  phoneNumber?: string
  website?: string
  openingHours?: string | string[] // Bisa berupa teks atau array hari kerja
  photoUrl?: string // URL foto tempat
}

export interface GoogleMapsResponse {
  results: Psychiatrist[]
}
