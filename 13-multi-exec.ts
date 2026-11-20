import { Redis } from "ioredis";

const url = process.env.REDIS_URL ?? "redis://127.0.0.1:6379";
const redis = new Redis(url);
const other = new Redis(url);
await redis.del("m2:tx:status", "m2:tx:version");

// 1. Atomic: both commands run, or neither.
const r1 = await redis.multi().set("m2:tx:status", "approved").incr("m2:tx:version").exec();
console.log("multi result:", r1?.map(([, reply]) => reply));

// 2. Optimistic lock: WATCH aborts EXEC if the key changes in between.
await redis.watch("m2:tx:status");
await other.set("m2:tx:status", "changed-by-someone-else");
const r2 = await redis.multi().set("m2:tx:status", "approved-again").exec();
console.log("after conflict:", r2); // null means the transaction was aborted
console.log("value is:", await redis.get("m2:tx:status"));

await redis.del("m2:tx:status", "m2:tx:version");
await redis.quit();
await other.quit();
