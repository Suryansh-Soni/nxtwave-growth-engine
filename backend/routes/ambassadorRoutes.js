import express from "express";

import {
  createAmbassador,
  getAmbassador,
  getLeaderboard,
  trackReferralClick,
} from "../controllers/ambassadorController.js";


const router = express.Router();

router.post("/", createAmbassador);

router.post("/track-click", trackReferralClick);

router.get("/leaderboard", getLeaderboard);

router.get("/:referralCode", getAmbassador);

export default router;