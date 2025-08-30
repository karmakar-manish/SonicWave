import { Router } from "express";
import { getAllSongs, getFeaturedSongs, getMadeForYou, getTrendingSongs } from "../controller/song.controller";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware";
const router = Router()

//to get all songs for admin
router.get("/", protectRoute, requireAdmin, getAllSongs)    

router.get("/featured", getFeaturedSongs)    
router.get("/made-for-you", getMadeForYou)    
router.get("/trending", getTrendingSongs)    


export default router 