import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Mongo DB connected successfully");
  } catch (err) {
    console.error("Something went wrong while connecting mongo db", err);
  }
}
