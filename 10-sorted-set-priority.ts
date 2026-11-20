import { Redis } from "ioredis";

const redis = new Redis(process.env.REDIS_URL ?? "redis://127.0.0.1:6379");
const key = "m2:reviews:pending";
await redis.del(key);
// score = the time (in seconds) when the run began waiting
await redis.zadd(key, 1000, "run-a", 4000, "run-b", 2500, "run-c");
console.log("oldest first:", await redis.zrange(key, 0, "-1"));
console.log("with scores :", await redis.zrange(key, 0, "-1", "WITHSCORES"));
const now = 5000;
const overdue = await redis.zrangebyscore(key, 0, now - 3000); // waiting longer than 3000 s
console.log("overdue     :", overdue);
await redis.del(key);
await redis.quit();
