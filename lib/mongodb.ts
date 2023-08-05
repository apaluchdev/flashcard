import mongoose from "mongoose";

let initialized: boolean = false;

console.log("Mongoose initializing...");

export default function InitializeMongoose() {
  if (initialized) return;

  const MONGODB_URI =
    process.env.MONGODB_KEY || "mongodb://localhost:27017/my-mongo-db"; // Replace with your MongoDB connection string

  const client = mongoose
    .connect(MONGODB_URI)
    .then((result) => console.log("Mongoose connected"))
    .catch((error) => console.log("Mongoose error: " + error));

  initialized = true;
}

// let cachedClient: any = null;
// export default async function connectToDatabase(): Promise<Mongoose> {
//   if (cachedClient) {
//     return cachedClient;
//   }

//   const client = await mongoose.connect(MONGODB_URI);
//   cachedClient = client;
//   return client;
// }
