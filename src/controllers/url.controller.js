import status from "http-status";
import { urlService, userService } from "../services/index.js";
import ShortUniqueId from "short-unique-id";
import { UAParser } from "ua-parser-js";
import geoip from "geoip-lite";
import getSetRedisCache from "../utils/get-set-redis-cache.js";

export const createShortUrl = async (req, res) => {
  try {
    let alias = req.body?.alias || "";
    if (!alias) {
      // generate random alias
      alias = new ShortUniqueId({ length: 10 }).randomUUID();
      Object.assign(req.body, { alias });
    }

    const result = await urlService.createShortUrl({
      ...req.body,
      user_id: req.user.userId,
    });

    if (!result) {
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        error: "Failed to shorten url",
      });
    }

    return res.status(status.CREATED).json(result);
  } catch (error) {
    console.error("Erroe creating short url", error);
    return res.status(status.INTERNAL_SERVER_ERROR).json({
      error: "Something went wrong. Please try again.",
    });
  }
};

// /api/shorten/{alias}
export const redirectToOriginalUrl = async (req, res) => {
  try {
    const alias = req.params?.alias;
    if (!alias) {
      return res.status(400).json({ error: "Missing params" });
    }

    const result = await getSetRedisCache(`redirect:${alias}`, async () => {
      return await urlService.getByAlias(alias);
    });

    if (!result) {
      return res.status(404).json({ error: "Alias not found" });
    }
    Promise.resolve(storeAnalytics(req, result)).catch(console.error);

    return res.redirect(result.original_url);
  } catch (error) {
    console.error("Error redirecting short URL", error);
    return res.status(500).json({
      error: "Something went wrong. Please try again.",
    });
  }
};

async function storeAnalytics(req, shortUrlData) {
  try {
    if (!req) {
      throw new Error("Invalid request");
    }

    const ua = UAParser(req.headers["user-agent"]);
    let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    console.log(
      "🚀 ~ storeAnalytics ~ req.socket.remoteAddress:",
      req.socket.remoteAddress
    );
    console.log(
      "🚀 ~ storeAnalytics ~ req.headers",
      req.headers["x-forwarded-for"]
    );
    console.log("🚀 ~ storeAnalytics ~ ip:", ip);
    if (ip === "::1") {
      ip = "127.0.0.1"; // Replace with localhost
    }
    const geo = geoip.lookup(ip);
    console.log("🚀 ~ storeAnalytics ~ geo:", geo);

    console.log("🚀 ~ storeAnalytics ~ ua:", ua);
    await urlService.storeRedirectAnalytics({
      ip_address: ip,
      short_url_id: shortUrlData._id,
      os: ua.os.name,
      device_type: ua.device.type,
      browser: ua.browser.name,
      country: geo?.country,
      region: geo?.region,
      time_zone: geo?.timezone,
      city: geo?.city,
      lat: geo?.ll[0],
      lon: geo?.ll[1],
    });
  } catch (error) {
    throw error;
  }
}

export async function getAliasList(req, res) {
  try {
    const backend_url = process.env.SERVER_URL;

    if (!backend_url) {
      throw new Error("Missing backend url. Check env variables.");
    }
    const result = await urlService.getAliases();
    if (!result?.length) {
      return res.status(status.NOT_FOUND).json({
        message: "No aliases",
      });
    }

    const aliaslist = result.map(
      (item) => `${backend_url}/api/shorten/${item.alias}`
    );
    return res.json(aliaslist);
  } catch (error) {
    return res.status(status.INTERNAL_SERVER_ERROR).json({
      error: "Something went wrong.",
    });
  }
}

export async function getAnalyticsByAlias(req, res) {
  try {
    const alias = req.params?.alias;
    if (!alias) {
      return res.status(status.BAD_REQUEST).json({
        error: "Missing Params.",
      });
    }

    // Check if alias exists in cache or database
    const aliasExists = await getSetRedisCache(
      `alias-exists:${alias}`,
      async () => {
        return await urlService.getByAlias(alias);
      },
      60 * 60 * 2
    );

    if (!aliasExists) {
      return res.status(404).json({ error: "Alias not found" });
    }

    const result = await getSetRedisCache(
      `alias-analytics:${alias}`,
      async () => {
        return await urlService.getAnalyticsByUrlId(alisExists._id);
      }
    );

    return res.json(result);
  } catch (error) {
    console.log("🚀 ~ getAnalyticsByAlias ~ error:", error);
    return res.status(status.INTERNAL_SERVER_ERROR).json({
      error: "Something went wrong.",
    });
  }
}

export async function getAnalyticsByTopic(req, res) {
  try {
    const topic = req.params?.topic;
    if (!topic) {
      return res.status(status.BAD_REQUEST).json({
        error: "Missing Params",
      });
    }

    const topciExist = await getSetRedisCache(
      `redis-exists:${topic}`,
      async () => {
        return await urlService.getTopicByName(topic);
      }
    );

    if (!topciExist) {
      return res.status(status.NOT_FOUND).json({
        error: "Topic not found",
      });
    }

    const result = await getSetRedisCache(
      `topic-analytics:${topic}`,
      async () => {
        return await urlService.getAnalyticsByTopicId(topciExist._id);
      }
    );
    return res.status(status.OK).json(result);
  } catch (error) {
    console.log("🚀 ~ getAnalyticsByTopicId ~ error:", error);
    return res.status(status.INTERNAL_SERVER_ERROR).json({
      error: "Something went wrong.",
    });
  }
}

export async function geteAnalyticsByUser(req, res) {
  try {
    const user = req?.user;
    if (!user) {
      return res.status(status.UNAUTHORIZED).json({
        error: "Unauthrized user",
      });
    }

    const userExists = await getSetRedisCache(
      `user-exists:${user.userId}`,
      async () => {
        return await userService.getUserById(req.user?.userId);
      }
    );

    if (!userExists) {
      return res.status(status.NOT_FOUND).json({
        error: "User not found",
      });
    }
    const result = await getSetRedisCache(
      `user-analytics:${userExists._id}`,
      async () => {
        return await urlService.getOverallANalyticsByUserId(userExists._id);
      }
    );

    return res.json(result);
  } catch (error) {
    console.log("🚀 ~ geteAnalyticsByUser ~ error:", error);
    return res.status(status.INTERNAL_SERVER_ERROR).json({
      error: "Something went wrong.",
    });
  }
}
