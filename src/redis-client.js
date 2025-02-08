import { createClient } from "redis";

// Use environment variables for Redis connection
const redisHost = process.env.REDIS_HOST || "localhost";
const redisPort = process.env.REDIS_PORT || 6379;

const client = createClient({
  url: `redis://${redisHost}:${redisPort}`,
});

client.on("error", (err) => console.log("Redis Client Error", err));

export const connectRedis = async () => {
  try {
    console.log("connecting to redis...");
    await client.connect();
    console.log("connected to redis");
  } catch (error) {
    console.error("failed to connect to redis", error);
    process.exit(1);
  }
};

export default client;
