import { writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

import { config } from "../config/env.js";
import { EmployeeModel } from "../models/employee.js";
import { parseDate } from "../utils/helpers.js";
import logger from "../utils/logger.js";
import { sendWelcomeEmail } from "../emails/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = resolve(__dirname, "../../uploads");

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
    const employees = await EmployeeModel.findAll();

    const dateKeys = ["birthday", "dob", "date of birth", "birth date", "birth day"];

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentDate = today.getDate();
    const currentYear = today.getFullYear();

    let birthdaysThisMonth = 0;
    const todayBirthdays = [];
    const upcomingBirthdays = [];

    for (const emp of employees) {
      if (emp.dateOfBirth) {
        const bd = parseDate(emp.dateOfBirth);
        if (bd) {
          if (bd.getMonth() === currentMonth) {
            birthdaysThisMonth++;
          }
          if (bd.getMonth() === currentMonth && bd.getDate() === currentDate) {
            todayBirthdays.push(emp);
          }
          const thisYearBd = new Date(currentYear, bd.getMonth(), bd.getDate());
          const diffDays = Math.ceil((thisYearBd - today) / (1000 * 60 * 60 * 24));
          if (diffDays >= 0 && diffDays <= 7) {
            upcomingBirthdays.push({ ...emp, _nextBirthday: thisYearBd });
          }
        }
      }
    }

    upcomingBirthdays.sort((a, b) => a._nextBirthday - b._nextBirthday);

    const withImage = employees.filter((e) => e.photoUrl);

    res.json({
      success: true,
      data: {
        totalEmployees: employees.length,
        birthdaysThisMonth,
        todayBirthdayCount: todayBirthdays.length,
        todayBirthdays,
        upcomingBirthdays,
        upcomingCount: upcomingBirthdays.length,
        employeesWithImage: withImage.length,
        employeesWithoutImage: employees.length - withImage.length,
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
    const newEmail = updates["Email"]?.trim();
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
      title: updates["Title"] ?? existing.title,
      name: updates["Employee Name"] ?? updates["Name"] ?? existing.name,
      email: newEmail ?? existing.email,
      department: updates["Department"] ?? existing.department,
      designation: updates["Designation"] ?? existing.designation,
      dateOfBirth: updates["Date of Birth"] ?? updates["Birthday"] ?? updates["DOB"] ?? existing.dateOfBirth,
      photoUrl: updates["Employee Image"] ?? existing.photoUrl,
    };

    if (mapped.dateOfBirth && typeof mapped.dateOfBirth === "string") {
      const d = new Date(mapped.dateOfBirth);
      if (!isNaN(d.getTime())) {
        mapped.dateOfBirth = d.toISOString().slice(0, 10);
      }
    }

    await EmployeeModel.update(id, mapped);
    res.json({ success: true, message: "Employee updated successfully." });
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
    if (!existsSync(UPLOADS_DIR)) mkdirSync(UPLOADS_DIR, { recursive: true });
    const dest = resolve(UPLOADS_DIR, `${employeeId}.png`);
    writeFileSync(dest, req.file.buffer);
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
      if (!existsSync(UPLOADS_DIR)) mkdirSync(UPLOADS_DIR, { recursive: true });
      const dest = resolve(UPLOADS_DIR, `${employeeId}.png`);
      writeFileSync(dest, req.file.buffer);
    }

    let formattedDob = dateOfBirth || "";
    if (formattedDob) {
      const d = new Date(formattedDob);
      if (!isNaN(d.getTime())) {
        formattedDob = d.toISOString().slice(0, 10);
      }
    }

    const record = await EmployeeModel.create({
      employeeId,
      title: title ?? "",
      name,
      email,
      department: department ?? "",
      designation: designation ?? "",
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
