import mongoose from "mongoose";

const connection: { isConnected: number } = { isConnected: 0 };

async function connect() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MongoDB URI is missing");
  }

  if (connection.isConnected) {
    console.log("Using existing connection");
    return;
  }

  if (mongoose.connection.readyState === 1) {
    connection.isConnected = mongoose.connection.readyState;
    console.log("Using existing connection");
    return;
  }

  const db = await mongoose.connect(process.env.MONGODB_URI);
  connection.isConnected = db.connections[0].readyState;
}

export default connect;
