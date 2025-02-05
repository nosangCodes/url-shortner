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
  console.log("🚀 ~ getTopicByName ~ topic:", topic);
  try {
    const result = await Topic.findOne({
      topic: topic,
    });

    return result;
  } catch (error) {
    throw error;
  }
};
