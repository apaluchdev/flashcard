import mongoose from "mongoose";

export default function InitializeMongoose() {
  console.log("Mongoose initializing...");

  const MONGODB_URI =
    process.env.MONGODB_KEY || "mongodb://localhost:27017/my-mongo-db"; // Replace with your MongoDB connection string

  var options = {
    autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
  };

  mongoose
    .connect(MONGODB_URI)
    .then((result) => console.log("Mongoose connected"))
    .catch((error) => console.log("Mongoose error: " + error));
}
