import { createCanvas, loadImage } from "canvas";
import sharp from "sharp";
import logger from "../utils/logger.js";
import { TemplateModel } from "../models/template.js";
import { WishModel } from "../models/wish.js";
import { downloadBlob } from "./azureBlob.js";

const CANVAS_W = 1080;
const CANVAS_H = 1080;

// ── Drawing helpers (unchanged logic) ────────────────────────────────────────

const drawOverlay = (ctx, cfg, W, H) => {
  if (!cfg?.enabled) return;
  const grad = ctx.createLinearGradient(0, H * cfg.yStart, 0, H);
  grad.addColorStop(0, cfg.colorStart);
  grad.addColorStop(1, cfg.colorEnd);
  ctx.fillStyle = grad;
  ctx.fillRect(0, H * cfg.yStart, W, H - H * cfg.yStart);
};

const drawPhoto = (ctx, cfg, W, H, img) => {
  if (!cfg || Object.keys(cfg).length === 0) {
    const s = 0.22 * W;
    const x = (W - s) / 2;
    const y = 0.26 * H;
    const cx = x + s / 2;
    const cy = y + s / 2;
    const r = s / 2;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    const scale = Math.max(s / img.width, s / img.height);
    const sw = s / scale;
    const sh = s / scale;
    const sx = (img.width - sw) / 2;
    const sy = (img.height - sh) / 2;
    ctx.drawImage(img, sx, sy, sw, sh, x, y, s, s);
    ctx.restore();
    ctx.beginPath();
    ctx.arc(cx, cy, r + 4, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.lineWidth = 4;
    ctx.stroke();
    return;
  }

  const s = cfg.size * W;
  const align = cfg.align ?? "center";
  const cxDef = align === "right" ? 0.95 : align === "left" ? 0.05 : 0.5;
  const cx = (cfg.cx ?? cxDef) * W;
  const cy = cfg.cy * H;
  const x = align === "left" ? cx : align === "right" ? cx - s : cx - s / 2;
  const y = cfg.cy * H - s / 2;
  const r = s / 2;

  ctx.save();
  ctx.beginPath();
  if (cfg.shape === "rounded") {
    const rad = s * 0.15;
    ctx.roundRect(x, y, s, s, rad);
  } else {
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
  }
  ctx.closePath();
  ctx.clip();

  const scale = Math.max(s / img.width, s / img.height);
  const sw = s / scale;
  const sh = s / scale;
  const sx = (img.width - sw) / 2;
  const sy = (img.height - sh) / 2;
  ctx.drawImage(img, sx, sy, sw, sh, x, y, s, s);
  ctx.restore();

  const bw = cfg.borderWidth ?? 4;
  ctx.beginPath();
  if (cfg.shape === "rounded") {
    const rad = s * 0.15;
    ctx.roundRect(x - bw / 2, y - bw / 2, s + bw, s + bw, rad + 2);
  } else {
    ctx.arc(cx, cy, r + bw / 2, 0, Math.PI * 2);
  }
  ctx.strokeStyle = cfg.borderColor ?? "#000000";
  ctx.lineWidth = bw;
  ctx.stroke();
};

const drawGreeting = (ctx, cfg, W, H) => {
  if (!cfg || Object.keys(cfg).length === 0) return;
  const { cy = 0.48, fontSize = 36, color = "rgba(255,255,255,0.85)", bold = false, align = "center" } = cfg;
  if (fontSize === 0) return;
  const cx = cfg.cx ?? (align === "right" ? 0.95 : align === "left" ? 0.05 : 0.5);
  ctx.textAlign = align;
  ctx.textBaseline = "top";
  ctx.font = bold ? `bold ${fontSize}px sans-serif` : `${fontSize}px sans-serif`;
  ctx.fillStyle = color;
  ctx.fillText(cfg.text || "Happy Birthday!", cx * W, cy * H);
};

const drawName = (ctx, cfg, W, H, employeeName) => {
  if (!cfg || Object.keys(cfg).length === 0) return;
  const { cy = 0.55, fontSize = 52, color = "#ffffff", bold = true, align = "center" } = cfg;
  const cx = cfg.cx ?? (align === "right" ? 0.95 : align === "left" ? 0.05 : 0.5);
  ctx.textAlign = align;
  ctx.textBaseline = "top";
  ctx.font = bold ? `bold ${fontSize}px sans-serif` : `${fontSize}px sans-serif`;
  ctx.fillStyle = color;
  ctx.fillText(employeeName, cx * W, cy * H);
};

const drawQuoteText = (ctx, cfg, W, H, quoteText) => {
  if (!quoteText) return;
  const { color = "rgba(255,255,255,0.9)", fontSize = 28, cy = 0.63, maxWidth = 750, bold = false, align = "center" } = cfg ?? {};
  const cx = cfg?.cx ?? (align === "right" ? 0.95 : align === "left" ? 0.05 : 0.5);
  ctx.font = bold ? `bold ${fontSize}px sans-serif` : `${fontSize}px sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = "top";
  ctx.fillStyle = color;

  const lineHeight = fontSize + 14;
  const words = quoteText.split(" ");
  const lines = [];
  let line = "";

  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  lines.push(line);

  const startY = cy * H;
  lines.forEach((l, i) => {
    ctx.fillText(l, cx * W, startY + i * lineHeight);
  });
};

// ── Main export ──────────────────────────────────────────────────────────────

/**
 * Generate a birthday card image.
 *
 * @param {string} employeeName - Name to render on the card
 * @param {Buffer} employeeImageBuffer - Employee photo buffer
 * @param {string|null} templateFile - Specific template file name (null = random)
 * @param {string|null} quoteOverride - If provided, use this instead of random DB quote
 * @param {object|null} configOverride - If provided, use this config instead of DB lookup
 * @returns {Buffer} PNG image buffer
 */
export const generateBirthdayCard = async (
  employeeName,
  employeeImageBuffer,
  templateFile = null,
  quoteOverride = null,
  configOverride = null
) => {
  const W = CANVAS_W;
  const H = CANVAS_H;

  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");

  // Resolve template config — from override, DB, or pick random
  let tmplCfg = configOverride;
  let selectedFile = templateFile;

  if (!tmplCfg) {
    let templateRecord;
    if (selectedFile) {
      templateRecord = await TemplateModel.findByFile(selectedFile);
    } else {
      templateRecord = await TemplateModel.random();
    }

    if (templateRecord) {
      selectedFile = templateRecord.file;
      tmplCfg = {
        photo: templateRecord.photo,
        greeting: templateRecord.greeting,
        name: templateRecord.nameConfig,
        quote: templateRecord.quote,
        overlay: templateRecord.overlay,
      };
    }
  }

  // Draw background
  if (selectedFile) {
    try {
      const bgBuffer = await downloadBlob(selectedFile);
      const bg = await loadImage(bgBuffer);
      ctx.drawImage(bg, 0, 0, W, H);
    } catch (err) {
      logger.error(`Failed to load template background from Azure: ${err.message}`);
    }
  } else {
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, "#667eea");
    grad.addColorStop(1, "#764ba2");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }

  drawOverlay(ctx, tmplCfg?.overlay, W, H);

  // Draw employee photo
  let empImg = null;
  try {
    const png = await sharp(employeeImageBuffer).png().toBuffer();
    empImg = await loadImage(png);
  } catch {
    logger.error("Failed to load employee image");
  }

  if (empImg) {
    drawPhoto(ctx, tmplCfg?.photo, W, H, empImg);
  } else {
    const s = 0.22 * W;
    const x = (W - s) / 2;
    const y = 0.26 * H;
    ctx.fillStyle = "#ddd";
    ctx.beginPath();
    ctx.arc(W / 2, y + s / 2, s / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#999";
    ctx.font = `${s * 0.35}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("\uD83D\uDC64", W / 2, y + s / 2);
  }

  drawGreeting(ctx, tmplCfg?.greeting, W, H);
  drawName(ctx, tmplCfg?.name, W, H, employeeName);

  // Quote: use override, or fetch random from DB
  const quoteText = quoteOverride || (await WishModel.random());
  drawQuoteText(ctx, tmplCfg?.quote, W, H, quoteText);

  return canvas.toBuffer("image/png");
};
