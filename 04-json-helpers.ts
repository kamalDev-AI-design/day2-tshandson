import { Redis } from "ioredis";
import { z } from "zod";

const redis = new Redis(process.env.REDIS_URL ?? "redis://127.0.0.1:6379");

async function setJson(key: string, value: unknown, ttlSeconds: number): Promise<void> {
  await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
}

async function getJson<T>(key: string, schema: z.ZodType<T>): Promise<T | undefined> {
  const raw = await redis.get(key);
  if (raw === null) return undefined;
  const parsed = schema.safeParse(JSON.parse(raw));
  return parsed.success ? parsed.data : undefined;
}

const Page = z.object({ locale: z.string(), price: z.number() });
const key = "m2:page:en-US";

await setJson(key, { locale: "en-US", price: 60 }, 60);
console.log(await getJson(key, Page));
await setJson(key, { price: 60 }, 60);
console.log(await getJson(key, Page));
await redis.del(key);
await redis.quit();
