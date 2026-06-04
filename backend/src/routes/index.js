import { Router } from "express";
import { BirthdayWisher } from "../jobs/birthdayWisher.js";
import { generatePreviewCards } from "../services/testService.js";

import { login, logout, me } from "../controllers/authController.js";
import multer from "multer";

import {
  getEmployees,
  getDashboardStats,
  updateEmployee,
  createEmployee,
  uploadEmployeePhoto,
} from "../controllers/employeeController.js";
import { createSheetController } from "../controllers/sheetController.js";

import { config } from "../config/env.js";

const router = Router();

// ── Auth routes ──────────────────────────────────────────────────────────────

router.post("/auth/login", login);
router.post("/auth/logout", logout);
router.get("/auth/me", me);

// ── Employee routes ──────────────────────────────────────────────────────────

const upload = multer({ storage: multer.memoryStorage() });

router.get("/employees", getEmployees);
router.post("/employees", upload.single("photo"), createEmployee);
router.put("/employees/:id", updateEmployee);
router.put("/employees/:id/photo", upload.single("photo"), uploadEmployeePhoto);

// ── Dashboard routes ─────────────────────────────────────────────────────────

router.get("/dashboard/stats", getDashboardStats);

// ── Sheet CRUD routes ────────────────────────────────────────────────────────

const sheetTabs = [
  { name: config.googleSheetQuotesTab, path: "quotes" },
  { name: config.googleSheetDepartmentTab, path: "departments" },
  { name: config.googleSheetDesignationTab, path: "designations" },
];

for (const { name, path } of sheetTabs) {
  const ctrl = createSheetController(name);
  router.get(`/sheet/${path}`, ctrl.list);
  router.post(`/sheet/${path}`, ctrl.create);
  router.put(`/sheet/${path}/:row`, ctrl.update);
  router.delete(`/sheet/${path}/:row`, ctrl.remove);
}

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
