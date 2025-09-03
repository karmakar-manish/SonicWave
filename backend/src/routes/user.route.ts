import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware";
import { getAllUsers, getMessages } from "../controller/user.controller";
const router = Router()

router.get("/", protectRoute, getAllUsers)

// route to get all the messages 
router.get("/messages/:userId", protectRoute, getMessages)

export default router 