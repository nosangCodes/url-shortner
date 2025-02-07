import { createClient } from "redis";

const client = createClient();

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
