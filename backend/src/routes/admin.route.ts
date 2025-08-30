import { Router } from "express";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware";
import {checkAdmin, createAlbum, createSong, deleteAlbum, deleteSong} from "../controller/admin.controller";
const router = Router()

router.get("/checkAdmin",protectRoute,checkAdmin)

//all the below routes will use these middlewares
router.use(protectRoute, requireAdmin)



router.post("/songs", createSong)
router.delete("/songs/:id", deleteSong)
router.post("/albums", createAlbum)
router.delete("/albums/:id", deleteAlbum)

export default router 