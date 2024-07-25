import mongoose, { Model } from "mongoose";
const Schema = mongoose.Schema;

export interface ITopic extends Document {
  _id?: string;
  topicTitle: string;
  userId: string;
}

const topicSchema = new Schema<ITopic>(
  {
    topicTitle: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const Topic: Model<ITopic> =
  mongoose.models?.Topic || mongoose.model<ITopic>("Topic", topicSchema);

export default Topic;
