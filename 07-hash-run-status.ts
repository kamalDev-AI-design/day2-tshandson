import { Redis } from "ioredis";

const redis = new Redis(process.env.REDIS_URL ?? "redis://127.0.0.1:6379");
const key = "m2:run:run-1";
await redis.del(key);
await redis.hset(key, { status: "running", node: "ingest", reruns: 0 });
await redis.hset(key, { status: "awaiting_review", node: "human_review" });
await redis.hincrby(key, "reruns", 1);
console.log("status:", await redis.hget(key, "status"));
console.log("all   :", await redis.hgetall(key));
await redis.del(key);
await redis.quit();
