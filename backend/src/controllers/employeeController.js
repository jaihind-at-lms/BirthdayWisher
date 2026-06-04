import { writeFileSync, existsSync, mkdirSync, unlinkSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

import dayjs from "dayjs";
import { config } from "../config/env.js";
import { EmployeeModel } from "../models/employee.js";
import { DepartmentModel } from "../models/department.js";
import { DesignationModel } from "../models/designation.js";
import logger from "../utils/logger.js";
import { sendWelcomeEmail } from "../emails/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = resolve(__dirname, "../../uploads");

async function resolveRef(value, model) {
  if (value == null || value === "") return null;
  const num = Number(value);
  if (!isNaN(num)) return num;
  const record = await model.findOrCreateByName(value);
  return record.id;
}

export async function getEmployees(req, res) {
  try {
    const data = await EmployeeModel.findAll();
    res.json({ success: true, data, totalRecords: data.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getDashboardStats(req, res) {
  try {
    const [stats, todayBirthdays, upcomingBirthdays] = await Promise.all([
      EmployeeModel.getAggregateStats(),
      EmployeeModel.findTodayBirthdays(),
      EmployeeModel.findUpcomingBirthdays(7),
    ]);

    res.json({
      success: true,
      data: {
        totalEmployees: stats.total,
        birthdaysThisMonth: stats.monthCount,
        todayBirthdayCount: stats.todayCount,
        todayBirthdays,
        upcomingBirthdays,
        upcomingCount: upcomingBirthdays.length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateEmployee(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;

    const existing = await EmployeeModel.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Employee not found." });
    }

    // Check duplicate email if being changed
    const newEmail = updates.email?.trim();
    if (newEmail && newEmail.toLowerCase() !== existing.email.toLowerCase()) {
      const dup = await EmployeeModel.findByEmail(newEmail);
      if (dup) {
        return res.status(409).json({
          success: false,
          message: `Email "${newEmail}" is already in use by another employee.`,
        });
      }
    }

    const mapped = {
      title: updates.title ?? existing.title,
      name: updates.name ?? existing.name,
      email: newEmail ?? existing.email,
      department: updates.department != null ? await resolveRef(updates.department, DepartmentModel) : existing.department,
      designation: updates.designation != null ? await resolveRef(updates.designation, DesignationModel) : existing.designation,
      dateOfBirth: updates.dateOfBirth ?? existing.dateOfBirth,
      photoUrl: updates.photoUrl ?? existing.photoUrl,
      employeeId: updates.employeeId ?? existing.employeeId,
    };

    if (mapped.dateOfBirth && typeof mapped.dateOfBirth === "string") {
      const d = dayjs(mapped.dateOfBirth);
      if (d.isValid()) {
        mapped.dateOfBirth = d.format("YYYY-MM-DD");
      }
    }

    await EmployeeModel.update(id, mapped);
    res.json({ success: true, message: "Employee updated successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function deleteEmployee(req, res) {
  try {
    const { id } = req.params;
    const employee = await EmployeeModel.findById(id);
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found." });
    }
    
    // Delete employee photo if it exists
    const photoPath = resolve(UPLOADS_DIR, `${employee.employeeId}.png`);
    if (existsSync(photoPath)) {
      try {
        unlinkSync(photoPath);
      } catch (err) {
        logger.warn("Failed to delete employee photo", { error: err.message, employeeId: employee.employeeId });
      }
    }
    
    await EmployeeModel.delete(id);
    res.json({ success: true, message: "Employee deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function uploadEmployeePhoto(req, res) {
  try {
    const { id: employeeId } = req.params;
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No photo file provided." });
    }
    // Enforce max file size 1MB
    const MAX_BYTES = 1024 * 1024
    if (req.file.size != null && req.file.size > MAX_BYTES) {
      return res.status(413).json({ success: false, message: "File too large. Maximum allowed size is 1MB." });
    }
    if (!existsSync(UPLOADS_DIR)) mkdirSync(UPLOADS_DIR, { recursive: true });
    const dest = resolve(UPLOADS_DIR, `${employeeId}.png`);
    writeFileSync(dest, req.file.buffer);
    
    // Update the employee's updatedAt timestamp to force cache refresh on frontend
    await EmployeeModel.updateWithEmployeeId(employeeId, {});
    
    res.json({ success: true, message: "Photo updated successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function createEmployee(req, res) {
  try {
    const { title, name, email, employeeId, department, designation, dateOfBirth, sendWelcome, welcomeTextLine1, welcomeTextLine2 } = req.body;

    if (!name || !email || !employeeId) {
      return res.status(400).json({
        success: false,
        message: "name, email, and employeeId are required.",
      });
    }

    // Check duplicates
    const dup = await EmployeeModel.isDuplicate({ employeeId, email });
    if (dup) {
      if (dup.employeeId === employeeId) {
        return res.status(409).json({ success: false, message: `Employee ID "${employeeId}" already exists.` });
      }
      return res.status(409).json({ success: false, message: `Email "${email}" is already in use.` });
    }

    // Save photo if provided
    if (req.file) {
      // Enforce max file size 1MB
      const MAX_BYTES = 1024 * 1024
      if (req.file.size != null && req.file.size > MAX_BYTES) {
        return res.status(413).json({ success: false, message: "Photo too large. Maximum allowed size is 1MB." });
      }
      if (!existsSync(UPLOADS_DIR)) mkdirSync(UPLOADS_DIR, { recursive: true });
      const dest = resolve(UPLOADS_DIR, `${employeeId}.png`);
      writeFileSync(dest, req.file.buffer);
    }

    let formattedDob = dateOfBirth || "";
    if (formattedDob) {
      const d = dayjs(formattedDob);
      if (d.isValid()) {
        formattedDob = d.format("YYYY-MM-DD");
      }
    }

    const record = await EmployeeModel.create({
      employeeId,
      title: title ?? "",
      name,
      email,
      department: department ? await resolveRef(department, DepartmentModel) : null,
      designation: designation ? await resolveRef(designation, DesignationModel) : null,
      dateOfBirth: formattedDob || null,
      photoUrl: `uploads/${employeeId}.png`,
    });

    // Send welcome email if opted in
    if (sendWelcome === "true" || sendWelcome === true) {
      const photoUrl = `${config.appUrl}/uploads/${employeeId}.png`;
      sendWelcomeEmail({
        title,
        name,
        email,
        department,
        designation,
        photoUrl,
        welcomeTextLine1,
        welcomeTextLine2: welcomeTextLine2 ?? "",
      }).catch((err) => {
        logger.error("Failed to send welcome email", { error: err.message, employeeId });
      });
    }

    res.json({ success: true, message: "Employee created successfully.", data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
