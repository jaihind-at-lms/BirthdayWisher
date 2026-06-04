import { Redis } from "ioredis";
import { config } from "./env.js";

export const redis = new Redis({
  host: config.redisHost,
  port: config.redisPort,
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => {
    if (times > 3) return null;
    return Math.min(times * 200, 2000);
  },
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err.message);
});
