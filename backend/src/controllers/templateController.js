import { TemplateModel } from "../models/template.js";
import { generateBirthdayCard } from "../services/birthdayCard.js";
import { uploadToBlob, deleteBlob, getBlobUrl } from "../services/azureBlob.js";
import { config } from "../config/env.js";
import sharp from "sharp";
import logger from "../utils/logger.js";

const TEMPLATES_FOLDER = config.azureTemplatesFolder;

export const templateController = {
  async list(req, res) {
    try {
      const data = await TemplateModel.findAll();
      res.json({ success: true, data, totalRecords: data.length });
    } catch (err) {
      logger.error("Template list error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async getById(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid id." });
      const record = await TemplateModel.findById(id);
      if (!record) return res.status(404).json({ success: false, message: "Template not found." });
      res.json({ success: true, data: record });
    } catch (err) {
      logger.error("Template getById error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async create(req, res) {
    try {
      const { name, photo, greeting, nameConfig, quote, overlay } = req.body;

      if (!name) return res.status(400).json({ success: false, message: "Name is required." });
      if (!req.file) return res.status(400).json({ success: false, message: "Template image is required." });

      // Convert to PNG and upload to Azure
      const fileName = `template-${Date.now()}.png`;
      const pngBuffer = await sharp(req.file.buffer).png().toBuffer();
      const blobName = await uploadToBlob(pngBuffer, fileName, TEMPLATES_FOLDER);
      const imageUrl = getBlobUrl(blobName);

      const record = await TemplateModel.create({
        name,
        file: blobName,
        imageUrl,
        photo: photo ? JSON.parse(photo) : {},
        greeting: greeting ? JSON.parse(greeting) : {},
        nameConfig: nameConfig ? JSON.parse(nameConfig) : {},
        quote: quote ? JSON.parse(quote) : {},
        overlay: overlay ? JSON.parse(overlay) : {},
      });

      res.json({ success: true, message: "Template created successfully.", data: record });
    } catch (err) {
      logger.error("Template create error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async update(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid id." });

      const existing = await TemplateModel.findById(id);
      if (!existing) return res.status(404).json({ success: false, message: "Template not found." });

      const { name, photo, greeting, nameConfig, quote, overlay, active } = req.body;

      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (photo !== undefined) updateData.photo = typeof photo === "string" ? JSON.parse(photo) : photo;
      if (greeting !== undefined) updateData.greeting = typeof greeting === "string" ? JSON.parse(greeting) : greeting;
      if (nameConfig !== undefined) updateData.nameConfig = typeof nameConfig === "string" ? JSON.parse(nameConfig) : nameConfig;
      if (quote !== undefined) updateData.quote = typeof quote === "string" ? JSON.parse(quote) : quote;
      if (overlay !== undefined) updateData.overlay = typeof overlay === "string" ? JSON.parse(overlay) : overlay;
      if (active !== undefined) updateData.active = active === "true" || active === true;

      // If a new image is uploaded, replace on Azure
      if (req.file) {
        const fileName = `template-${Date.now()}.png`;
        const pngBuffer = await sharp(req.file.buffer).png().toBuffer();
        const blobName = await uploadToBlob(pngBuffer, fileName, TEMPLATES_FOLDER);
        const imageUrl = getBlobUrl(blobName);

        // Delete old blob
        if (existing.file) {
          try { await deleteBlob(existing.file); } catch { /* ignore */ }
        }

        updateData.file = blobName;
        updateData.imageUrl = imageUrl;
      }

      const record = await TemplateModel.update(id, updateData);
      res.json({ success: true, message: "Template updated successfully.", data: record });
    } catch (err) {
      logger.error("Template update error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async remove(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid id." });

      const existing = await TemplateModel.findById(id);
      if (!existing) return res.status(404).json({ success: false, message: "Template not found." });

      // Delete blob from Azure
      if (existing.file) {
        try { await deleteBlob(existing.file); } catch { /* ignore */ }
      }

      await TemplateModel.remove(id);
      res.json({ success: true, message: "Template deleted successfully." });
    } catch (err) {
      logger.error("Template remove error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  /** Generate a preview card using test data */
  async preview(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid id." });

      const template = await TemplateModel.findById(id);
      if (!template) return res.status(404).json({ success: false, message: "Template not found." });

      const testName = req.body.name || "John Doe";
      const testQuote = req.body.quote || "Wishing you a wonderful birthday!";

      let testImageBuffer;
      if (req.file) {
        testImageBuffer = req.file.buffer;
      } else {
        // Create a simple placeholder image
        testImageBuffer = await sharp({
          create: { width: 400, height: 400, channels: 3, background: { r: 200, g: 200, b: 200 } },
        }).png().toBuffer();
      }

      // Use the config from the request body if provided (for live preview before saving)
      const previewConfig = {
        photo: req.body.photo ? (typeof req.body.photo === "string" ? JSON.parse(req.body.photo) : req.body.photo) : template.photo,
        greeting: req.body.greeting ? (typeof req.body.greeting === "string" ? JSON.parse(req.body.greeting) : req.body.greeting) : template.greeting,
        name: req.body.nameConfig ? (typeof req.body.nameConfig === "string" ? JSON.parse(req.body.nameConfig) : req.body.nameConfig) : template.nameConfig,
        quote: req.body.quoteConfig ? (typeof req.body.quoteConfig === "string" ? JSON.parse(req.body.quoteConfig) : req.body.quoteConfig) : template.quote,
        overlay: req.body.overlay ? (typeof req.body.overlay === "string" ? JSON.parse(req.body.overlay) : req.body.overlay) : template.overlay,
      };

      const cardBuffer = await generateBirthdayCard(
        testName,
        testImageBuffer,
        template.file,
        testQuote,
        previewConfig
      );

      res.set("Content-Type", "image/png");
      res.send(cardBuffer);
    } catch (err) {
      logger.error("Template preview error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  },
};
