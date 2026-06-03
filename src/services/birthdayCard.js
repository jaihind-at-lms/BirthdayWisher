import { createCanvas, loadImage } from "canvas";
import { readdirSync, readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = resolve(__dirname, "../templates");
const CONFIG_PATH = resolve(__dirname, "../config/template-config.json");

const QUOTES = [
  "Another year, another adventure — go make it legendary!",
  "Age is just a number, but your vibe is timeless.",
  "You don't get older, you level up. Happy Birthday!",
  "Cheers to the amazing person you are and the journey ahead.",
  "May your day be filled with cake, laughter, and good vibes.",
  "The world is brighter because you're in it. Happy Birthday!",
  "Celebrate today like the superstar you are!",
  "Here's to you — may your year be as awesome as you are.",
  "Another chapter, another win. Keep shining!",
  "Happy Birthday — you're the main character, act like it!",
  "Sending you good wishes, good vibes, and good cake.",
  "You're not getting older, you're becoming a classic.",
  "It's your day — eat cake, be happy, and let others sing.",
  "Born to stand out. Happy Birthday, legend!",
  "May your day be as wonderful as the joy you bring to others.",
];

const ACCENT_COLORS = [
  "#ffd700", "#ff6b6b", "#48dbfb", "#ff9ff3", "#54a0ff",
  "#5f27cd", "#01a3a4", "#f368e0", "#ffa502", "#2ed573",
];

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const loadAnyImage = async (path) => {
  const buf = readFileSync(path);
  const png = await sharp(buf).png().toBuffer();
  return loadImage(png);
};

const loadConfig = () => {
  try {
    if (!existsSync(CONFIG_PATH)) return null;
    return JSON.parse(readFileSync(CONFIG_PATH, "utf-8"));
  } catch {
    return null;
  }
};

const findTemplateConfig = (config, templateFile) => {
  if (!config?.templates) return null;
  return config.templates.find((t) => t.file === templateFile) ?? null;
};

const drawOverlay = (ctx, cfg, W, H) => {
  if (!cfg?.enabled) return;
  const grad = ctx.createLinearGradient(0, H * cfg.yStart, 0, H);
  grad.addColorStop(0, cfg.colorStart);
  grad.addColorStop(1, cfg.colorEnd);
  ctx.fillStyle = grad;
  ctx.fillRect(0, H * cfg.yStart, W, H - H * cfg.yStart);
};

const drawPhoto = (ctx, cfg, W, H, img) => {
  if (!cfg) {
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
  const x = cfg.cx * W - s / 2;
  const y = cfg.cy * H - s / 2;
  const cx = cfg.cx * W;
  const cy = cfg.cy * H;
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
  ctx.strokeStyle = cfg.borderColor;
  ctx.lineWidth = bw;
  ctx.stroke();
};

const drawGreeting = (ctx, cfg, W, H) => {
  if (!cfg) return;
  const { cx = 0.5, cy = 0.48, fontSize = 36, color = "rgba(255,255,255,0.85)", bold = false } = cfg;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.font = bold ? `bold ${fontSize}px sans-serif` : `${fontSize}px sans-serif`;
  ctx.fillStyle = color;
  ctx.fillText("Happy Birthday!", cx * W, cy * H);
};

const drawName = (ctx, cfg, W, H, employeeName, accentColor) => {
  if (!cfg) return;
  const { cx = 0.5, cy = 0.55, fontSize = 52, color = "#ffffff", bold = true } = cfg;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.font = bold ? `bold ${fontSize}px sans-serif` : `${fontSize}px sans-serif`;
  ctx.fillStyle = color;
  ctx.fillText(employeeName, cx * W, cy * H);

  const underlineY = cy * H + fontSize + 8;
  const tw = ctx.measureText(employeeName).width;
  ctx.fillStyle = accentColor;
  ctx.fillRect(cx * W - tw / 2, underlineY, tw, 3);
};

const drawQuote = (ctx, cfg, W, H, accentColor) => {
  const quote = getRandomItem(QUOTES);
  const color = cfg?.color ?? "rgba(255,255,255,0.9)";
  const fontSize = cfg?.fontSize ?? 28;
  const cx = cfg?.cx ?? 0.5;
  const cy = cfg?.cy ?? 0.63;
  const maxWidth = cfg?.maxWidth ?? 750;

  ctx.font = `${fontSize}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillStyle = color;

  const lineHeight = fontSize + 14;
  const words = quote.split(" ");
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
    const prefix = i === 0 ? "\u201C" : "";
    const suffix = i === lines.length - 1 ? "\u201D" : "";
    ctx.fillText(`${prefix}${l}${suffix}`, cx * W, startY + i * lineHeight);
  });
};

export const generateBirthdayCard = async (employeeName, employeeImagePath, templateFile) => {
  const config = loadConfig();
  const W = config?.canvas?.width ?? 1080;
  const H = config?.canvas?.height ?? 1080;

  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");

  const selectedFile = templateFile ?? getRandomItem(
    readdirSync(TEMPLATES_DIR)
  );
  const tmplCfg = findTemplateConfig(config, selectedFile);

  if (selectedFile) {
    const bg = await loadImage(resolve(TEMPLATES_DIR, selectedFile));
    ctx.drawImage(bg, 0, 0, W, H);
  } else {
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, "#667eea");
    grad.addColorStop(1, "#764ba2");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }

  drawOverlay(ctx, tmplCfg?.overlay, W, H);

  let empImg;
  try {
    empImg = await loadAnyImage(employeeImagePath);
  } catch {
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
    return canvas.toBuffer("image/png");
  }

  const accentColor = getRandomItem(ACCENT_COLORS);
  drawPhoto(ctx, tmplCfg?.photo, W, H, empImg);
  drawGreeting(ctx, tmplCfg?.greeting, W, H);
  drawName(ctx, tmplCfg?.name, W, H, employeeName, accentColor);
  drawQuote(ctx, tmplCfg?.quote, W, H, accentColor);

  return canvas.toBuffer("image/png");
};
