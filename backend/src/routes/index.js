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
  deleteEmployee,
} from "../controllers/employeeController.js";

import { wishController } from "../controllers/wishController.js";
import { departmentController } from "../controllers/departmentController.js";
import { designationController } from "../controllers/designationController.js";

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
router.delete("/employees/:id", deleteEmployee);
router.put("/employees/:id/photo", upload.single("photo"), uploadEmployeePhoto);

// ── Dashboard routes ─────────────────────────────────────────────────────────

router.get("/dashboard/stats", getDashboardStats);

// ── Wishes ───────────────────────────────────────────────────────────────────

router.get("/wishes", wishController.list);
router.post("/wishes", wishController.create);
router.put("/wishes/:id", wishController.update);
router.delete("/wishes/:id", wishController.remove);

// ── Departments ──────────────────────────────────────────────────────────────

router.get("/departments", departmentController.list);
router.post("/departments", departmentController.create);
router.put("/departments/:id", departmentController.update);
router.delete("/departments/:id", departmentController.remove);

// ── Designations ─────────────────────────────────────────────────────────────

router.get("/designations", designationController.list);
router.post("/designations", designationController.create);
router.put("/designations/:id", designationController.update);
router.delete("/designations/:id", designationController.remove);

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
