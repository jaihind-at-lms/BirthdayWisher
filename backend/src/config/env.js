import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT ?? "8082", 10),
  ntfyTopic: process.env.NTFY_TOPIC,

  // Supabase PostgreSQL
  supabaseDbUrl: process.env.SUPABASE_DB_URL ?? "",

  // Auth
  jwtSecret: process.env.JWT_SECRET ?? "lms-birthdaywisher-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",

  // Redis
  redisHost: process.env.REDIS_HOST ?? "localhost",
  redisPort: parseInt(process.env.REDIS_PORT ?? "6379", 10),

  // Email whitelist
  allowedEmails: (process.env.ALLOWED_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean),

  // SMTP (system sender for automated emails)
  smtpUser: process.env.SMTP_USER ?? "",
  smtpPassword: process.env.SMTP_PASSWORD ?? "",

  // App URL (used to build absolute URLs in emails)
  appUrl: (process.env.APP_URL ?? "http://localhost:3000").replace(/\/+$/, ""),

  // Welcome email recipient (usually all-staff list)
  emailTo: process.env.EMAIL_TO ?? "",

  // Microsoft Graph API (for uploading to OneDrive/SharePoint)
  msAuthTenantId: process.env.MS_AUTH_TENANT_ID ?? "",
  msAuthClientId: process.env.MS_AUTH_CLIENT_ID ?? "",
  msAuthClientSecret: process.env.MS_AUTH_CLIENT_SECRET ?? "",
  msDriveId: process.env.MS_DRIVE_ID ?? "",
  msDriveUser: process.env.MS_DRIVE_USER ?? "",
  msEmployeeImagesFolder: process.env.MS_EMPLOYEE_IMAGES_FOLDER ?? "employee-images",
  msBirthdayCardsFolder: process.env.MS_BIRTHDAY_CARDS_FOLDER ?? "birthday-cards",
};
