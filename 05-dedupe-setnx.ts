import { Redis } from "ioredis";

const redis = new Redis(process.env.REDIS_URL ?? "redis://127.0.0.1:6379");

async function acceptOnce(eventId: string): Promise<boolean> {
  const result = await redis.set(`m2:seen:${eventId}`, "1", "EX", 3600, "NX");
  return result === "OK";
}

await redis.del("m2:seen:evt-1", "m2:seen:evt-2");
console.log("evt-1 first time :", await acceptOnce("evt-1"));
console.log("evt-1 duplicate  :", await acceptOnce("evt-1"));
console.log("evt-2 first time :", await acceptOnce("evt-2"));
await redis.del("m2:seen:evt-1", "m2:seen:evt-2");
await redis.quit();
