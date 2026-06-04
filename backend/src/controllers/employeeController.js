import { writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

import { getSheetRecords, updateSheetCell, appendSheetRow, getSheetHeaders } from "../services/index.js";
import { config } from "../config/env.js";
import { trimKeys, parseDate } from "../utils/helpers.js";
import logger from "../utils/logger.js";
import { sendWelcomeEmail } from "../emails/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = resolve(__dirname, "../../uploads");
const RANGE = `${config.googleSheetEmployeeTab}!A:Z`;

export async function getEmployees(req, res) {
  try {
    const rows = await getSheetRecords(RANGE);
    const employees = rows.map(trimKeys);
    res.json({ success: true, data: employees, totalRecords: employees.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getDashboardStats(req, res) {
  try {
    const rows = await getSheetRecords(RANGE);
    const employees = rows.map(trimKeys);

    const dateKeys = ["birthday", "dob", "date of birth", "birth date", "birth day"];
    const first = employees[0] || {};
    const dateCol = Object.keys(first).find(
      (k) => dateKeys.includes(k.toLowerCase())
    );

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentDate = today.getDate();
    const currentYear = today.getFullYear();

    let birthdaysThisMonth = 0;
    const todayBirthdays = [];
    const upcomingBirthdays = [];

    for (const emp of employees) {
      if (dateCol && emp[dateCol]) {
        const bd = parseDate(emp[dateCol]);
        if (bd) {
          if (bd.getMonth() === currentMonth) {
            birthdaysThisMonth++;
          }
          if (
            bd.getMonth() === currentMonth &&
            bd.getDate() === currentDate
          ) {
            todayBirthdays.push(emp);
          }
          const thisYearBd = new Date(currentYear, bd.getMonth(), bd.getDate());
          const diffDays = Math.ceil(
            (thisYearBd - today) / (1000 * 60 * 60 * 24)
          );
          if (diffDays >= 0 && diffDays <= 7) {
            upcomingBirthdays.push({ ...emp, _nextBirthday: thisYearBd });
          }
        }
      }
    }

    upcomingBirthdays.sort(
      (a, b) => a._nextBirthday - b._nextBirthday
    );

    const imageCol = Object.keys(first).find(
      (k) => k.toLowerCase().includes("image") || k.toLowerCase().includes("photo")
    );
    const withImage = imageCol
      ? employees.filter((e) => e[imageCol])
      : [];

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

    const rows = await getSheetRecords(RANGE);
    const headers = Object.keys(rows[0]);

    const index = rows.findIndex(
      (r) => r[headers.find((h) => h.trim().toLowerCase() === "employee id")]?.trim() === id
    );
    if (index === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found in sheet." });
    }

    const rowNumber = index + 2;
    const cellValues = headers.map((h) => {
      const key = h.trim();
      if (key.toLowerCase() === "employee id") return id;
      const matchedKey = Object.keys(updates).find(
        (k) => key.toLowerCase() === k.toLowerCase()
      );
      return matchedKey ? updates[matchedKey] : rows[index][h];
    });

    const range = `${config.googleSheetEmployeeTab}!A${rowNumber}:${String.fromCharCode(64 + headers.length)}${rowNumber}`;
    await updateSheetCell(range, [cellValues]);

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

    // Save photo if provided
    if (req.file) {
      if (!existsSync(UPLOADS_DIR)) mkdirSync(UPLOADS_DIR, { recursive: true });
      const dest = resolve(UPLOADS_DIR, `${employeeId}.png`);
      writeFileSync(dest, req.file.buffer);
    }

    // Read sheet headers and append row
    const rows = await getSheetRecords(RANGE);
    let headers = Object.keys(rows[0] || {});
    if (!headers.length) {
      headers = await getSheetHeaders(RANGE);
    }

    let formattedDob = dateOfBirth || "";
    if (formattedDob) {
      const d = new Date(formattedDob);
      if (!isNaN(d.getTime())) {
        formattedDob = d.toISOString().slice(0, 10);
      }
    }

    const fieldMap = { title, name, email, employeeId, department, designation, dateOfBirth: formattedDob };
    const lookup = {
      name: ["Employee Name", "Name", "name"],
      employeeId: ["Employee ID", "Employee Id", "employee id", "ID", "id"],
      email: ["Email", "email"],
      department: ["Department", "department"],
      designation: ["Designation", "designation"],
      title: ["Title", "title"],
      dateOfBirth: ["Date of Birth", "Date of birth", "date of birth", "Birthday", "birthday", "DOB", "dob"],
    };

    const values = headers.map((h) => {
      const lower = h.trim().toLowerCase();
      for (const [field, aliases] of Object.entries(lookup)) {
        if (aliases.some((a) => a.toLowerCase() === lower)) {
          return fieldMap[field] ?? "";
        }
      }
      return "";
    });

    console.log("[createEmployee] headers found:", headers);
    console.log("[createEmployee] values to append:", values);

    await appendSheetRow(RANGE, [values]);

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

    res.json({ success: true, message: "Employee created successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
