import { Router } from 'express'
import { PlacesController } from '../controllers/places.controller'

const router = Router()
const placesController = new PlacesController()

router.get('/search', (req, res, next) => placesController.searchNearby(req, res, next))
router.get('/details/:placeId', (req, res, next) => placesController.getDetails(req, res, next))

export default router
