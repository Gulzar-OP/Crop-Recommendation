import { Router } from "express";
import { createRecommendation, deleteHistory, getHistory } from "../controllers/recommendationController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);
router.post("/", createRecommendation);
router.get("/history", getHistory);
router.delete("/history/:id", deleteHistory);
export default router;
