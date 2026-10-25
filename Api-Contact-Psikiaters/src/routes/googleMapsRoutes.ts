import { Router } from "express";
import {
  getPsychiatristsFromGoogleMaps,
  getPsychiatristByPlaceId,
} from "../controllers/googleMapsController";

const router = Router();

// Route untuk mendapatkan daftar psychiatrist
router.get("/google-maps/psychiatrists", getPsychiatristsFromGoogleMaps);

// Route untuk mendapatkan psychiatrist berdasarkan placeId
router.get("/google-maps/psychiatrist/:placeId", getPsychiatristByPlaceId);

export default router;
