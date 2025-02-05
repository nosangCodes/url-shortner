import ShortUrl from "../models/short-url.model.js";

export const createShortUrl = async (data) => {
  try {
    const res = await ShortUrl.create({
      user_id: data.user_id,
      alias: data.alias,
      original_url: data.original_url,
    });
    return res;
  } catch (error) {
    // console.error("error creating alias url", error);
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
