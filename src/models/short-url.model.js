import mongoose, { Schema } from "mongoose";

const shortUrlSchema = new Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    original_url: String,
    alias: String,
  },
  {
    timestamps: true,
  }
);

const ShortUrl = mongoose.model("ShortUrl", shortUrlSchema);

export default ShortUrl;
