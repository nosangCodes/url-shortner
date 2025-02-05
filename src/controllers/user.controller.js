import status from "http-status";
import { userService } from "../services/index.js";
import { generateAccessToken } from "../utils/token-helper.js";

export const createUser = async (req, res) => {
  try {
    let user;
    let userCreated = false;
    if (req?.user?.provider === "google") {
      const userData = req.user._json;
      user = await userService.getUserByGoogleId(userData.sub);
      if (!user) {
        user = await userService.createUser({
          provider: "google",
          google_id: userData.sub,
          email: userData.email,
          name: userData.name,
          email_verified: userData.email_verified,
          picture: userData.picture,
        });
        userCreated = true;
      } else {
        userCreated = false;
      }

      const accessToken = generateAccessToken({
        email: user.email,
        id: user.id,
      });
      const refreshToken = generateAccessToken({
        email: user.email,
        id: user.id,
      });

      return res.status(userCreated ? status.CREATED : status.OK).json({
        accessToken,
        refreshToken,
        message: userCreated
          ? "user created successfully"
          : "user already exists",
      });
    }
  } catch (error) {
    console.error("Error in createUser controller:", error);
    return res.status(status.INTERNAL_SERVER_ERROR).json({
      error: "Something went wrong. Please try again later.",
    });
  }
};
