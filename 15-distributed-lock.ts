import { Redis } from "ioredis";
import { randomUUID } from "node:crypto";

const redis = new Redis(process.env.REDIS_URL ?? "redis://127.0.0.1:6379");
const lockKey = "m2:lock:run-1";
await redis.del(lockKey);

async function acquire(): Promise<string | null> {
  const token = randomUUID();
  const ok = await redis.set(lockKey, token, "PX", 30_000, "NX");
  return ok === "OK" ? token : null;
}

// delete only if the value still matches our token (atomic in Lua)
const RELEASE = `if redis.call("get", KEYS[1]) == ARGV[1] then return redis.call("del", KEYS[1]) else return 0 end`;

async function release(token: string): Promise<boolean> {
  return (await redis.eval(RELEASE, 1, lockKey, token)) === 1;
}

const workerA = await acquire();
const workerB = await acquire();
console.log("worker A got lock:", workerA !== null);
console.log("worker B got lock:", workerB !== null);
console.log("B releases with a wrong token:", await release("not-my-token"));
console.log("A releases:", await release(workerA!));
console.log("B tries again:", (await acquire()) !== null);

await redis.del(lockKey);
await redis.quit();
