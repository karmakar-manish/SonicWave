import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware";
import { getAllUsers, getMessages, updateProfile } from "../controller/user.controller";
const router = Router()

router.get("/", protectRoute, getAllUsers)

// route to get all the messages 
router.get("/messages/:userId", protectRoute, getMessages)

//route to update profile image and fullname
router.put("/update-profile", protectRoute, updateProfile)

export default router 