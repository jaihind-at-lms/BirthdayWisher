import { Router } from "express";
import { BirthdayWisher } from "../jobs/birthdayWisher.js";
import { generatePreviewCards } from "../services/testService.js";

import { login, logout, me } from "../controllers/authController.js";

const router = Router();

// ── Auth routes ──────────────────────────────────────────────────────────────

router.post("/auth/login", login);
router.post("/auth/logout", logout);
router.get("/auth/me", me);

// ── Birthday wisher routes ───────────────────────────────────────────────────

router.get("/birthday-wisher/trigger", async (req, res) => {
  try {
    const result = await BirthdayWisher();
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/birthday-wisher/status", (_, res) => {
  res.json({
    job: "BirthdayWisher",
    schedule: "0 6 * * *",
    timezone: "Asia/Kolkata",
    nextRun: "Daily at 06:00 AM IST",
  });
});

router.get("/birthday-wisher/preview", async (_, res) => {
  try {
    const generated = await generatePreviewCards();
    res.json({ success: true, generated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
