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

  const payload = {
    from: config.smtpUser,
    to: config.node_env === "production" ? to : 'jaihind.pal@lmsin.com',
    cc: config.node_env === "production" ? cc : 'jaihind.pal@lmsin.com',
    subject,
    html,
    attachments,
  }

  const tr = getTransporter();
  const info = await tr.sendMail(payload);
  
  logger.info(`Email sent: "${subject}" -> ${payload.to}`, { messageId: info.messageId });
  return info;
}
