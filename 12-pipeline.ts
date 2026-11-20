import { Redis } from "ioredis";

const redis = new Redis(process.env.REDIS_URL ?? "redis://127.0.0.1:6379");
const pipe = redis.pipeline();
pipe.set("m2:p:1", "a");
pipe.set("m2:p:2", "b");
pipe.get("m2:p:1");
pipe.incr("m2:p:counter");
const results = await pipe.exec();
// each entry is [error, reply]
console.log(results?.map(([error, reply]) => (error ? `error ${error.message}` : reply)));
await redis.del("m2:p:1", "m2:p:2", "m2:p:counter");
await redis.quit();
