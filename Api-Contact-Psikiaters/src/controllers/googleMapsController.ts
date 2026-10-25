import { Request, Response } from 'express'
import { Client } from '@googlemaps/google-maps-services-js'

const googleMapsClient = new Client({})

// Dapatkan data Psychiatrist dari Google Maps
export const getPsychiatristsFromGoogleMaps = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { location, radius } = req.query

    if (!location || !radius) {
      res.status(400).json({ message: 'Location and radius are required' })
      return
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      res.status(500).json({ message: 'API key is missing' })
      return
    }

    const response = await googleMapsClient.placesNearby({
      params: {
        location: location as string, // e.g., "-6.200000,106.816666"
        radius: parseInt(radius as string),
        type: 'doctor',
        keyword: 'psychiatrist',
        key: apiKey
      },
      timeout: 1000
    })

    const results = await Promise.all(
      response.data.results.map(async (place) => {
        // Pastikan place_id ada dan valid
        if (!place.place_id) {
          return {
            error: 'Place ID is missing for some places'
          }
        }

        const placeDetails = await googleMapsClient.placeDetails({
          params: {
            place_id: place.place_id, // valid place_id
            key: apiKey
          },
          timeout: 1000
        })

        const details = placeDetails.data.result
        const photoUrl =
          details.photos && details.photos.length > 0
            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${details.photos[0].photo_reference}&key=${apiKey}`
            : null

        return {
          placeId: place.place_id,
          name: place.name || 'N/A',
          address: place.vicinity || 'N/A',
          rating: place.rating || 'N/A',
          userRatingsTotal: place.user_ratings_total || 'N/A',
          location: place.geometry?.location || 'N/A', // Periksa apakah geometry ada
          phoneNumber: details.formatted_phone_number || 'N/A',
          website: details.website || 'N/A',
          openingHours: details.opening_hours ? details.opening_hours.weekday_text : 'N/A',
          photoUrl: photoUrl || 'N/A'
        }
      })
    )

    res.status(200).json(results)
  } catch (error) {
    console.error('Error fetching data from Google Maps:', error)
    res.status(500).json({ message: 'Failed to fetch data from Google Maps' })
  }
}

// Dapatkan detail berdasarkan placeId
export const getPsychiatristByPlaceId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { placeId } = req.params
    if (!placeId) {
      res.status(400).json({ message: 'Place ID is required' })
      return
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      res.status(500).json({ message: 'API key is missing' })
      return
    }

    const placeDetails = await googleMapsClient.placeDetails({
      params: {
        place_id: placeId, // Valid place_id
        key: apiKey
      },
      timeout: 1000
    })

    const details = placeDetails.data.result
    const photoUrl =
      details.photos && details.photos.length > 0
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${details.photos[0].photo_reference}&key=${apiKey}`
        : null

    const result = {
      placeId: details.place_id,
      name: details.name || 'N/A',
      address: details.formatted_address || 'N/A',
      rating: details.rating || 'N/A',
      userRatingsTotal: details.user_ratings_total || 'N/A',
      location: details.geometry?.location || 'N/A', // Periksa apakah geometry ada
      phoneNumber: details.formatted_phone_number || 'N/A',
      website: details.website || 'N/A',
      openingHours: details.opening_hours ? details.opening_hours.weekday_text : 'N/A',
      photoUrl: photoUrl || 'N/A'
    }

    res.status(200).json(result)
  } catch (error) {
    console.error('Error fetching place details from Google Maps:', error)
    res.status(500).json({ message: 'Failed to fetch place details' })
  }
}
