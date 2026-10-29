import express from "express";
import { getGrowthAnalytics } from "../controllers/adminController.js";

const router = express.Router();

router.get("/analytics", getGrowthAnalytics);

export default router;