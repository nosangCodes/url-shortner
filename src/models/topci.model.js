import mongoose, { Schema } from "mongoose";

const topicSchema = new Schema(
  {
    topic: {
      type: String,
      unique: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Topic = mongoose.model("Topic", topicSchema);
export default Topic;
