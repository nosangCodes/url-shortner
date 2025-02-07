import Click from "../models/click.model.js";
import ShortUrl from "../models/short-url.model.js";
import Topic from "../models/topci.model.js";

export const createShortUrl = async (data) => {
  try {
    const res = await ShortUrl.create({
      user_id: data.user_id,
      alias: data.alias,
      original_url: data.original_url,
    });
    return res;
  } catch (error) {
    throw error;
  }
};

export const getByAlias = async (alias) => {
  try {
    const result = await ShortUrl.findOne({
      alias: alias,
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const storeRedirectAnalytics = async (data) => {
  try {
    const result = await Click.create(data);
    return result;
  } catch (error) {
    throw error;
  }
};

export const insertUrls = async (data, session) => {
  try {
    const result = await ShortUrl.insertMany(data, { session });
    return result;
  } catch (error) {
    throw error;
  }
};

export const createTopic = async (topic, session) => {
  try {
    const result = await Topic.create([{ topic }], { session });
    return result;
  } catch (error) {
    throw error;
  }
};

export const getTopicByName = async (topic = "") => {
  try {
    const result = await Topic.findOne({
      topic: topic,
    });

    return result;
  } catch (error) {
    throw error;
  }
};

export const getAliases = async () => {
  try {
    const result = await ShortUrl.find({}, { alias: true });
    return result;
  } catch (error) {
    throw error;
  }
};

export const getShortUrlIds = async () => {
  try {
    const result = await ShortUrl.find({}, { _id: true });
    return result.map((item) => item._id);
  } catch (error) {
    throw error;
  }
};

export const dumpAnalytics = async (data) => {
  try {
    const result = await Click.insertMany(data);
    return result;
  } catch (error) {
    throw error;
  }
};

export const getAnalyticsByUrlId = async (urlId) => {
  try {
    const totalClicks = await Click.where({
      short_url_id: urlId,
    }).countDocuments();

    const uniqueClicks = await Click.distinct("ip_address", {
      short_url_id: urlId,
    });

    const matchStage = {
      $match: {
        $and: [
          { short_url_id: urlId },
          {
            createdAt: {
              $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
              $lt: new Date(),
            },
          },
        ],
      },
    };

    const clicksByDate = await Click.aggregate([
      matchStage,
      {
        $group: {
          _id: {
            date: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
              },
            },
          },
          clicks: {
            $sum: 1,
          },
        },
      },

      {
        $project: {
          _id: 0,
          date: "$_id.date",
          clicks: 1,
        },
      },
      {
        $sort: { date: 1 },
      },
    ]);

    const osType = await Click.aggregate([
      matchStage,
      {
        $group: {
          _id: { $ifNull: ["$os", ""] },
          totalClicks: { $sum: 1 },
          uniqueUsers: { $addToSet: "$ip_address" },
        },
      },
      {
        $project: {
          _id: 0,
          os: "$_id",
          totalClicks: 1,
          uniqueClicks: { $size: "$uniqueUsers" },
        },
      },
    ]);

    const deviceType = await Click.aggregate([
      matchStage,
      {
        $group: {
          _id: { $ifNull: ["$device_type", ""] },
          totalClicks: { $sum: 1 },
          uniqueUsers: {
            $addToSet: "$ip_address",
          },
        },
      },
      {
        $project: {
          _id: 0,
          device: "$_id",
          totalClicks: 1,
          uniqueClicks: { $size: "$uniqueUsers" },
        },
      },
    ]);

    return {
      totalClicks,
      uniqueClicks: uniqueClicks.length,
      clicksByDate,
      osType,
      deviceType,
    };
  } catch (error) {
    throw error;
  }
};

export const getAnalyticsByTopicId = async (topicId) => {
  try {
    const result = {};

    const analytics = await Click.aggregate([
      {
        $match: {
          short_url_id: {
            $in: await ShortUrl.find({ topic: topicId }).distinct("_id"),
          },
        },
      },
      {
        $group: {
          _id: null,
          totalClicks: { $sum: 1 },
          uniqueClicks: { $addToSet: "$ip_address" },
        },
      },
      {
        $project: {
          _id: 0,
          totalClicks: 1,
          uniqueClicks: { $size: "$uniqueClicks" },
        },
      },
    ]);

    const clicksByDate = await Click.aggregate([
      {
        $match: {
          $and: [
            {
              short_url_id: {
                $in: await ShortUrl.find({ topic: topicId }).distinct("_id"),
              },
            },
            {
              createdAt: {
                $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
                $lt: new Date(),
              },
            },
          ],
        },
      },
      {
        $group: {
          _id: {
            date: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
              },
            },
          },
          totalClicks: { $sum: 1 },
        },
      },
      {
        $sort: {
          date: 1,
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id.date",
          totalClicks: 1,
        },
      },
    ]);

    const urls = await Click.aggregate([
      {
        $match: {
          short_url_id: {
            $in: await ShortUrl.find({ topic: topicId }).distinct("_id"),
          },
        },
      },
      {
        $lookup: {
          from: "shorturls",
          localField: "short_url_id",
          foreignField: "_id",
          as: "short_url",
        },
      },
      {
        $unwind: { path: "$short_url", preserveNullAndEmptyArrays: false },
      },
      {
        $group: {
          _id: "$short_url.alias",
          totalClicks: { $sum: 1 },
          uniqueClicks: { $addToSet: "$ip_address" },
        },
      },
      {
        $project: {
          _id: 0,
          shortUrl: {
            $concat: [process.env.SERVER_URL, "/api/shorten/", "$_id"],
          },
          totalClicks: 1,
          uniqueClicks: { $size: "$uniqueClicks" },
        },
      },
    ]);

    if (analytics.length === 0) {
      Object.assign(result, { totalClicks: 0, uniqueClicks: 0 }); // If no data is found
    }

    Object.assign(result, analytics[0]);
    Object.assign(result, { clicksByDate, urls });
    return result;
  } catch (error) {
    throw error;
  }
};
