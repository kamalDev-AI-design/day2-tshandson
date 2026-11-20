import { Redis } from "ioredis";

const redis = new Redis(process.env.REDIS_URL ?? "redis://127.0.0.1:6379");

let loaderCalls = 0;
async function loadCriteriaFromSource(id: string): Promise<string> {
  loaderCalls++;
  return `criteria text for ${id}`; // stands in for MongoDB or a vector search
}

async function getOrLoad(id: string): Promise<string> {
  const key = `m2:cache:criteria:${id}`;
  const hit = await redis.get(key);
  if (hit !== null) return hit;
  const value = await loadCriteriaFromSource(id);
  await redis.set(key, value, "EX", 300);
  return value;
}

await redis.del("m2:cache:criteria:AC-114");
console.log(await getOrLoad("AC-114"));
console.log(await getOrLoad("AC-114"));
console.log(await getOrLoad("AC-114"));
console.log("loader calls:", loaderCalls);
await redis.del("m2:cache:criteria:AC-114");
await redis.quit();
