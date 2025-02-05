import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    provider: {
      type: String,
      enum: ["google", "credentials"],
    },
    google_id: {
      type: String,
      unique: true,
      required: false,
    },
    email: {
      type: String,
      unique: true,
    },
    name: String,
    picture: String,
    email_vefified: Boolean,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
