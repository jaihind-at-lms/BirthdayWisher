import { getSheetRecords, updateSheetCell, appendSheetRow, deleteSheetRow } from "../services/index.js";
import { trimKeys, colLetter } from "../utils/helpers.js";

export function createSheetController(tabName) {
  const range = `${tabName}!A:Z`;

  return {
    async list(req, res) {
      try {
        const rows = await getSheetRecords(range);
        res.json({ success: true, data: rows.map(trimKeys), totalRecords: rows.length });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    },

    async create(req, res) {
      try {
        const body = req.body;
        const rows = await getSheetRecords(range);
        const headers = Object.keys(rows[0]);
        const values = headers.map((h) => body[h.trim()] ?? "");
        await appendSheetRow(range, [values]);
        res.json({ success: true, message: "Record created successfully." });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    },

    async update(req, res) {
      try {
        const { row } = req.params;
        const rowIndex = parseInt(row, 10);
        if (isNaN(rowIndex)) {
          return res.status(400).json({ success: false, message: "Invalid row index." });
        }
        const rows = await getSheetRecords(range);
        const headers = Object.keys(rows[0]);
        const sheetRow = rowIndex + 2;
        const values = headers.map((h) => req.body[h.trim()] ?? rows[rowIndex][h] ?? "");
        const updateRange = `${tabName}!A${sheetRow}:${colLetter(headers.length - 1)}${sheetRow}`;
        await updateSheetCell(updateRange, [values]);
        res.json({ success: true, message: "Record updated successfully." });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    },

    async remove(req, res) {
      try {
        const { row } = req.params;
        const rowIndex = parseInt(row, 10);
        if (isNaN(rowIndex)) {
          return res.status(400).json({ success: false, message: "Invalid row index." });
        }
        await deleteSheetRow(rowIndex, tabName);
        res.json({ success: true, message: "Record deleted successfully." });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    },
  };
}
