import { Request, Response, NextFunction } from 'express'
import { GoogleMapsService } from '../services/googleMaps.service'
import { SearchParams } from '../types/index'
import { config } from '../config'
import { AppError } from '../utils/AppError'

export class PlacesController {
  private googleMapsService: GoogleMapsService

  constructor() {
    this.googleMapsService = new GoogleMapsService()
  }

  async searchNearby(req: Request, res: Response, next: NextFunction) {
    try {
      const { lat, lng, radius, openNow } = req.query

      if (!lat || !lng) {
        return next(AppError('Location coordinates are required', 400))
      }

      const searchParams: SearchParams = {
        location: {
          lat: parseFloat(lat as string),
          lng: parseFloat(lng as string)
        },
        radius: parseInt(radius as string) || config.defaultRadius,
        openNow: openNow === 'true'
      }

      const places = await this.googleMapsService.searchNearbyPlaces(searchParams)
      const lengthPlaces = places.length
      res.json({
        status: 'success',
        total: lengthPlaces,
        data: places
      })
    } catch (error) {
      next(error)
    }
  }

  async getDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { placeId } = req.params
      const details = await this.googleMapsService.getPlaceDetails(placeId)
      res.json({
        status: 'success',
        data: details
      })
    } catch (error) {
      next(error)
    }
  }
}
