const mongoose = require("mongoose");

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/api/GetTopics",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0",
          },
        ],
      },
    ];
  },
};

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

module.exports = nextConfig;
