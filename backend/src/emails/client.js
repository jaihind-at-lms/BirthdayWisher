import nodemailer from "nodemailer";
import { config } from "../config/env.js";
import logger from "../utils/logger.js";

let transporter = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPassword,
      },
      tls: { ciphers: "SSLv3" },
    });
  }
  return transporter;
}

export async function sendMail({ to, cc, subject, html, attachments }) {
  if (!config.smtpUser || !config.smtpPassword) {
    throw new Error("SMTP credentials not configured");
  }
  const tr = getTransporter();
  const info = await tr.sendMail({
    from: config.smtpUser,
    to,
    cc,
    subject,
    html,
    attachments,
  });
  logger.info(`Email sent: "${subject}" -> ${to}`, { messageId: info.messageId });
  return info;
}
