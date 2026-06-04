import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { redis } from "../config/redis.js";
import { config } from "../config/env.js";

const ALLOWED_EMAILS = config.allowedEmails;

function isEmailAllowed(email) {
  return ALLOWED_EMAILS.includes(email.toLowerCase());
}

async function verifySmtpCredentials(email, password) {
  const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: { user: email, pass: password },
    tls: { ciphers: "SSLv3" },
    debug: false,
  });

  try {
    await transporter.verify();
    return true;
  } catch {
    return false;
  }
}

function generateTokens(email) {
  const payload = { email, role: "admin" };

  const accessToken = jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });

  const refreshToken = jwt.sign(
    { ...payload, type: "refresh" },
    config.jwtSecret,
    { expiresIn: "30d" }
  );

  return { accessToken, refreshToken };
}

async function storeSession(token, email, password) {
  const ttl = 7 * 24 * 60 * 60; // 7 days
  await redis.setex(
    `session:${token}`,
    ttl,
    JSON.stringify({ email, password })
  );
}

async function getSession(token) {
  const data = await redis.get(`session:${token}`);
  return data ? JSON.parse(data) : null;
}

async function destroySession(token) {
  await redis.del(`session:${token}`);
}

function extractNameFromEmail(email) {
  const local = email.split("@")[0];
  const parts = local.replace(/[._]/g, " ").split(" ");
  const capitalized = parts.map(
    (p) => p.charAt(0).toUpperCase() + p.slice(1)
  );
  return {
    firstName: capitalized[0] ?? "",
    lastName: capitalized.slice(1).join(" ") ?? "",
  };
}

export const authService = {
  isEmailAllowed,
  verifySmtpCredentials,
  generateTokens,
  storeSession,
  getSession,
  destroySession,
  extractNameFromEmail,
};
