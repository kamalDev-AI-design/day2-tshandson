import { Redis } from "ioredis";

const redis = new Redis(process.env.REDIS_URL ?? "redis://127.0.0.1:6379");
const LIMIT = 3;
const WINDOW_SECONDS = 60;
const key = "m2:rate:bedrock:window-1";
await redis.del(key);

async function allow(): Promise<boolean> {
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, WINDOW_SECONDS); // start the window on the first call
  return count <= LIMIT;
}

for (let i = 1; i <= 5; i++) {
  console.log(`call ${i} allowed:`, await allow());
}
await redis.del(key);
await redis.quit();
