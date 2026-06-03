import axios from "axios";
import { config } from "../config/env.js";

export const sendNtfy = (topic, message, meta = []) => {
  const formattedMessage = [
    typeof message === "object" ? JSON.stringify(message, null, 2) : message,
    ...meta.map((m) => JSON.stringify(m, null, 2)),
  ].join("\n");

  axios
    .post(`https://ntfy.sh/${topic}`, formattedMessage, {
      headers: { "Content-Type": "text/plain" },
      timeout: 3000,
    })
    .catch(() => {});
};
