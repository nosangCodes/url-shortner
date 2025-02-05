import mongoose, { Schema } from "mongoose";

const shortUrlSchema = new Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    original_url: {
      type: String,
      required: true,
    },
    alias: {
      type: String,
      unique: true,
      required: true,
    },
    topic: {
      type: mongoose.Types.ObjectId,
      ref: "Topic",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const ShortUrl = mongoose.model("ShortUrl", shortUrlSchema);

export default ShortUrl;
