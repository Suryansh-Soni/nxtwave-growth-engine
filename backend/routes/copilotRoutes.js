import express from "express";

import {
  generateGrowthStrategy,
} from "../controllers/copilotController.js";

const router = express.Router();

router.get("/strategy", generateGrowthStrategy);

export default router;