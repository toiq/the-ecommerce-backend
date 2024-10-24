import { createClient } from "redis";
import { env } from "../config/env.js";

const cacheClient = createClient({ url: env.REDIS_URL });
cacheClient.on("error", (err) => console.log("Redis Client Error", err));

// Connect to Redis
await cacheClient.connect();

export default cacheClient;
