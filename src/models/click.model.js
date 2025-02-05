import mongoose, { Schema } from "mongoose";

const clickSchema = new Schema(
  {
    ip_address: {
      type: String,
    },
    short_url_id: {
      type: mongoose.Types.ObjectId,
      ref: "ShortUrl",
    },
    browser: {
      type: String,
    },
    os: {
      type: String,
    },
    device_type: {
      type: String,
    },
    country: String,
    region: String,
    time_zone: String,
    city: String,
    lat: Number,
    lon: Number,
  },
  {
    timestamps: true,
  }
);

const Click = mongoose.model("Click", clickSchema);
export default Click;
