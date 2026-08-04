import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT ?? "8082", 10),
  node_env: process.env.NODE_ENV ?? "development",
  
  // Ntfy (for push notifications)
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

  // Welcome email recipient (usually all-staff list)
  emailTo: process.env.EMAIL_TO ?? "",

  // Azure Blob Storage
  azureStorageAccountName: process.env.AZURE_STORAGE_ACCOUNT_NAME ?? "",
  azureStorageAccountKey: process.env.AZURE_STORAGE_ACCOUNT_KEY ?? "",
  azureStorageConnectionString: process.env.AZURE_STORAGE_CONNECTION_STRING ?? "",
  azureStorageContainerName: process.env.AZURE_STORAGE_CONTAINER_NAME ?? "birthdaymailer",
  azureEmployeeImagesFolder: process.env.AZURE_EMPLOYEE_IMAGES_FOLDER ?? "employee-images",
  azureBirthdayCardsFolder: process.env.AZURE_BIRTHDAY_CARDS_FOLDER ?? "birthday-cards",
};
