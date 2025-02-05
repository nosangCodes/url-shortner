import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET;

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error(
    "Missing JWT secrets. Please set JWT_ACCESS_SECRET and JWT_REFRESH_SECRET in your environment variables."
  );
}

export function generateAccessToken(user) {
  try {
    if (!user?.id || !user?.email) {
      throw new Error("Invalid user data. Cannot generate token.");
    }

    return jwt.sign(
      { userId: user.id, email: user.email }, // Payload
      ACCESS_TOKEN_SECRET,
      { expiresIn: "12h" }
    );
  } catch (error) {
    console.error("Error creating access token:", error.message);
    throw error;
  }
}

export function generateRefreshToken(user) {
  try {
    if (!user?.id || !user?.email) {
      throw new Error("Invalid user data. Cannot generate token.");
    }

    return jwt.sign(
      { userId: user.id, email: user.email }, // Payload
      REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
  } catch (error) {
    console.error("Error creating refresh token:", error.message);
    throw error;
  }
}
