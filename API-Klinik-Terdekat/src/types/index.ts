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
  place_id: string
  name: string
  formatted_address?: string
  formatted_phone_number?: string
  rating?: number
  opening_hours?: {
    open_now: boolean
    weekday_text?: string[]
  }
  geometry: {
    location: Location
  }
  photos?: PlacePhoto[]
  photoUrl?: string
}
