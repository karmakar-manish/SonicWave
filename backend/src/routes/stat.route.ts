import { Router } from "express";
import { getStats } from "../controller/stat.controller";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware";

const router = Router()

router.get("/", protectRoute, requireAdmin, getStats)

export default router