import mongoose from "mongoose";

let initialized: boolean = false;

export default function InitializeMongoose() {
  if (initialized) return;

  console.log("Mongoose initializing...");

  const MONGODB_URI =
    process.env.MONGODB_KEY || "mongodb://localhost:27017/my-mongo-db"; // Replace with your MongoDB connection string

  mongoose
    .connect(MONGODB_URI)
    .then((result) => console.log("Mongoose connected"))
    .catch((error) => console.log("Mongoose error: " + error));

  initialized = true;
}
