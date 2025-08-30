import { Router } from "express";
import { login, logout, signup } from "../controller/auth.controller";
import { getCurrentUser, protectRoute } from "../middleware/auth.middleware";

const router = Router()

router.post("/signup", signup)
router.post("/login", login)
// router.post("/providerLogin", providerLogin)
router.post("/logout", logout)

router.use("/me", protectRoute, getCurrentUser)

export default router 