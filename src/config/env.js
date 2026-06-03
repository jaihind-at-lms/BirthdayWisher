import dotenv from "dotenv";
dotenv.config();

export const config = {
  ntfyTopic: process.env.NTFY_TOPIC,
};
