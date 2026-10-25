import { Client, Language } from '@googlemaps/google-maps-services-js'
import { SearchParams, PlaceDetails } from '../types'
import { config } from '../config'
import { AppError } from '../utils/AppError'

export class GoogleMapsService {
  private client: Client

  constructor() {
    this.client = new Client({})
  }

  async searchNearbyPlaces(params: SearchParams): Promise<PlaceDetails[]> {
    try {
      const { location, radius, openNow } = params

      const response = await this.client.placesNearby({
        params: {
          key: config.googleMapsApiKey as string,
          location: location,
          radius: radius,
          keyword: config.defaultKeywords,
          type: 'health',
          opennow: openNow,
          language: 'id' as Language // Menggunakan bahasa Indonesia
        }
      })

      const places = response.data.results

      // Tambahkan foto URL untuk setiap tempat
      const placesWithPhotos = await Promise.all(
        places.map(async (place) => {
          if (place.photos && place.photos.length > 0) {
            const photoUrl = await this.getPlacePhoto(place.photos[0].photo_reference)
            return { ...place, photoUrl }
          }
          return null
        })
      )

      return placesWithPhotos.filter((place) => place !== null) as PlaceDetails[]
    } catch {
      throw AppError('Failed to search nearby places', 500)
    }
  }

  async getPlaceDetails(placeId: string): Promise<PlaceDetails> {
    try {
      const response = await this.client.placeDetails({
        params: {
          key: config.googleMapsApiKey as string,
          place_id: placeId,
          language: 'id' as Language,
          fields: [
            'name',
            'formatted_address',
            'formatted_phone_number',
            'opening_hours',
            'rating',
            'geometry',
            'photos',
            'website',
            'reviews',
            'user_ratings_total'
          ]
        }
      })

      const details = response.data.result

      if (details.photos && details.photos.length > 0) {
        const photoUrl = await this.getPlacePhoto(details.photos[0].photo_reference)
        return { ...details, photoUrl } as PlaceDetails
      }

      return details as PlaceDetails
    } catch {
      throw AppError('Failed to get place details', 500)
    }
  }

  async getPlacePhoto(photoReference: string, maxWidth: number = 400): Promise<string> {
    try {
      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${config.googleMapsApiKey}`
    } catch {
      throw AppError('Failed to get place photo', 500)
    }
  }
}
