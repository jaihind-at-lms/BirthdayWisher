import { getSheetRecords, updateSheetCell } from "../services/index.js";
import { config } from "../config/env.js";
import { trimKeys, parseDate } from "../utils/helpers.js";

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
