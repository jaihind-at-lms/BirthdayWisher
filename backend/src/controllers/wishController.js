import { WishModel } from "../models/wish.js";

export const wishController = {
  async list(req, res) {
    try {
      const data = await WishModel.findAll();
      res.json({ success: true, data, totalRecords: data.length });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async create(req, res) {
    try {
      const { text } = req.body;
      if (!text) return res.status(400).json({ success: false, message: "Text is required." });
      const record = await WishModel.create(text);
      res.json({ success: true, message: "Wish created successfully.", data: record });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async update(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid id." });
      const { text } = req.body;
      if (!text) return res.status(400).json({ success: false, message: "Text is required." });
      const record = await WishModel.update(id, text);
      if (!record) return res.status(404).json({ success: false, message: "Wish not found." });
      res.json({ success: true, message: "Wish updated successfully.", data: record });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async remove(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid id." });
      const existing = await WishModel.findById(id);
      if (!existing) return res.status(404).json({ success: false, message: "Wish not found." });
      await WishModel.remove(id);
      res.json({ success: true, message: "Wish deleted successfully." });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};
