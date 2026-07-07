// import dns from 'node:dns';
// dns.setServers(['8.8.8.8', '1.1.1.1']);

import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected on host ${connect.connection.host}`);
  } catch (error) {
    console.log(`MongoDB connection failed`);
    process.exit(1);
  }
};
