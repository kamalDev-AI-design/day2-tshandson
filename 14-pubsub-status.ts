import { Redis } from "ioredis";

const url = process.env.REDIS_URL ?? "redis://127.0.0.1:6379";
const subscriber = new Redis(url); // a subscribing connection cannot run other commands
const publisher = new Redis(url);

const received: string[] = [];
const done = new Promise<void>((resolve) => {
  subscriber.on("message", (channel, message) => {
    console.log(`[${channel}] ${message}`);
    received.push(message);
    if (received.length === 2) resolve();
  });
});

await subscriber.subscribe("m2:run-events");
await publisher.publish("m2:run-events", JSON.stringify({ runId: "run-1", status: "awaiting_review" }));
await publisher.publish("m2:run-events", JSON.stringify({ runId: "run-1", status: "success" }));
await done;

await subscriber.quit();
await publisher.quit();
