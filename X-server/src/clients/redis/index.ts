import Redis from "ioredis";

export const redisClient = new Redis(
  process.env.REDUS_URL as string
);
