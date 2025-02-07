import redisClient from "../redis-client.js";

async function getSetRedisCache(key, cb, expiration = 60 * 60 * 2) {
  try {
    const cachedData = await redisClient.get(key);
    if (cachedData !== null) {
      console.log("cache hit");
      return JSON.parse(cachedData);
    }

    const freshData = await cb();
    console.log("cache miss");
    await redisClient.set(key, JSON.stringify(freshData), { EX: expiration });

    return freshData;
  } catch (error) {
    console.error("Redis cache error:", error);
    return cb(); // Fallback to fetching fresh data if Redis fails
  }
}

export default getSetRedisCache;
