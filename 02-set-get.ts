import { Redis } from "ioredis";

const redis = new Redis(process.env.REDIS_URL ?? "redis://127.0.0.1:6379");
const key = "m2:status:run-1";
await redis.del(key);
await redis.set(key, "awaiting_review");
console.log("GET ->", await redis.get(key));
console.log("EXISTS ->", await redis.exists(key));
await redis.del(key);
console.log("after DEL ->", await redis.get(key));
await redis.quit();
