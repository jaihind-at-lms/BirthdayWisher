import { DepartmentModel } from "../models/department.js";

export const departmentController = {
  async list(req, res) {
    try {
      const data = await DepartmentModel.findAll();
      res.json({ success: true, data, totalRecords: data.length });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async create(req, res) {
    try {
      const { name } = req.body;
      if (!name) return res.status(400).json({ success: false, message: "Name is required." });
      const existing = await DepartmentModel.findByName(name);
      if (existing) return res.status(409).json({ success: false, message: `Department "${name}" already exists.` });
      const record = await DepartmentModel.create(name);
      res.json({ success: true, message: "Department created successfully.", data: record });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async update(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid id." });
      const { name } = req.body;
      if (!name) return res.status(400).json({ success: false, message: "Name is required." });
      const record = await DepartmentModel.update(id, name);
      if (!record) return res.status(404).json({ success: false, message: "Department not found." });
      res.json({ success: true, message: "Department updated successfully.", data: record });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async remove(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid id." });
      await DepartmentModel.remove(id);
      res.json({ success: true, message: "Department deleted successfully." });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};
