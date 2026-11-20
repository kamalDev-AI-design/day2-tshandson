import { Redis } from "ioredis";

const redis = new Redis(process.env.REDIS_URL ?? "redis://127.0.0.1:6379");
console.log("PING ->", await redis.ping());
console.log("ECHO ->", await redis.echo("harness"));
await redis.quit();
console.log("connection closed");
