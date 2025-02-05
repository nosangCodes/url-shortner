import User from "../models/user.model.js";

export const createUser = async (userBody) => {
  try {
    const user = await User.create(userBody);
    return user;
  } catch (error) {
    throw error;
  }
};

export const getUserByGoogleId = async (googleId) => {
  try {
    const user = await User.findOne({
      google_id: googleId,
    });
    return user;
  } catch (error) {
    throw error;
  }
};

export const getUserIds = async () => {
  try {
    const ids = await User.find(
      {},
      {
        _id: true,
      }
    );
    return ids.map((id) => id?._id);
  } catch (error) {
    throw error;
  }
};


