import { Redis } from "ioredis";

const redis = new Redis(process.env.REDIS_URL ?? "redis://127.0.0.1:6379");
const key = "m2:run:run-1:verified";
await redis.del(key);
console.log("added:", await redis.sadd(key, "en-US", "de-DE", "en-US")); // duplicate ignored
console.log("count:", await redis.scard(key));
console.log("de-DE verified:", (await redis.sismember(key, "de-DE")) === 1);
console.log("ja-JP verified:", (await redis.sismember(key, "ja-JP")) === 1);
console.log("members:", (await redis.smembers(key)).sort());
await redis.del(key);
await redis.quit();
