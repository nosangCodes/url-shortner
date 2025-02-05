import User from "../models/user.model.js";

export const createUser = async (userBody) => {
  try {
    const user = await User.create(userBody);
    return user;
  } catch (error) {
    console.error("Error creating user", error);
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
    console.error("Error fetching user by google id", error);
    throw error;
  }
};
