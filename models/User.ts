import { ObjectId } from "mongodb";
import mongoose, { Model } from "mongoose";
const Schema = mongoose.Schema;

export interface IUser {
  _id?: string;
  username: string;
  email: string;
  bookmarkedCards?: string[];
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
    },
    bookmarkedCards: {
      type: [String],
      required: false,
    },
  },
  { timestamps: true },
);

const User: Model<IUser> =
  mongoose.models?.User || mongoose.model<IUser>("User", userSchema);
export default User;
