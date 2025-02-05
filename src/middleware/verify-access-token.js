import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET;

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error(
    "Missing JWT secrets. Please set JWT_ACCESS_SECRET and JWT_REFRESH_SECRET in your environment variables."
  );
}

export default function verufyAccessToken(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")?.[1];
    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized. Missing or invalid token." });
    }
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error verifying access token", error);
    return res
      .status(401)
      .json({ error: "Invalid or expired token. Please log in again." });
  }
}
