import express from "express";
import { getCropDetails } from "../controllers/cropController.js";

const router = express.Router();

router.get("/:cropName", getCropDetails);

export default router;