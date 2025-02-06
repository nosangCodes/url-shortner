import status from "http-status";
import { urlService, userService } from "../services/index.js";
import ShortUniqueId from "short-unique-id";
import { UAParser } from "ua-parser-js";
import geoip from "geoip-lite";

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
      return res.status(status.BAD_REQUEST).json({
        error: "Missing params",
      });
    }
    const result = await urlService.getByAlias(alias);
    if (!result) {
      return res.status(status.NOT_FOUND).json({
        error: "alias not found",
      });
    }

    // store analutics
    await storeAnalytics(req, result);

    return res.redirect(`${result.original_url}`);
  } catch (error) {
    console.error("Erroe redurecting short url", error);
    return res.status(status.INTERNAL_SERVER_ERROR).json({
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

    const alisExists = await urlService.getByAlias(alias);

    if (!alisExists) {
      return res.status(status.NOT_FOUND).json({
        error: "Alias not found",
      });
    }
    const result = await urlService.getAnalyticsByUrlId(alisExists._id);
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

    const topciExist = await urlService.getTopicByName(topic);
    if (!topciExist) {
      return res.status(status.NOT_FOUND).json({
        error: "Topic not found",
      });
    }
    const result = await urlService.getAnalyticsByTopicId(topciExist._id);
    return res.status(status.OK).json(result);
  } catch (error) {
    console.log("🚀 ~ getAnalyticsByTopicId ~ error:", error);
    return res.status(status.INTERNAL_SERVER_ERROR).json({
      error: "Something went wrong.",
    });
  }
}
