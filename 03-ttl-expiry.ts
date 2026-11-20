import { Redis } from "ioredis";

const redis = new Redis(process.env.REDIS_URL ?? "redis://127.0.0.1:6379");
const key = "m2:cache:criteria:AC-114";
await redis.del(key);
await redis.set(key, "List price is 55.00 from 1 May", "EX", 60);
console.log("has TTL:", (await redis.pttl(key)) > 0);
await redis.persist(key);
console.log("after PERSIST ttl =", await redis.ttl(key)); // -1 means no expiry
await redis.expire(key, 30);
console.log("after EXPIRE has TTL:", (await redis.ttl(key)) > 0);
await redis.del(key);
await redis.quit();
