import { Redis } from "ioredis";

const redis = new Redis(process.env.REDIS_URL ?? "redis://127.0.0.1:6379");
const key = "m2:queue:jobs";
await redis.del(key);
await redis.rpush(key, "job-1", "job-2", "job-3");
console.log("length:", await redis.llen(key));
console.log("peek  :", await redis.lrange(key, 0, -1));
console.log("pop   :", await redis.lpop(key));
console.log("pop   :", await redis.lpop(key));
console.log("left  :", await redis.lrange(key, 0, -1));
await redis.del(key);
await redis.quit();
