import Flashcard, { IFlashcard } from "@/models/Flashcard";
import Topic, { ITopic } from "@/models/Topic";
import mongoose from "mongoose";

export default function InitializeMongoose() {
  if (mongoose.connection.readyState === 1) {
    console.log("Mongoose already connected");
    return;
  }
  console.log("Mongoose initializing...");

  const MONGODB_URI =
    process.env.MONGODB_KEY || "mongodb://localhost:27017/my-mongo-db"; // Replace with your MongoDB connection string

  mongoose
    .connect(MONGODB_URI)
    .then((result) => console.log("Mongoose connected"))
    .catch((error) => console.log("Mongoose error: " + error));
}
