import mongoose from "mongoose";

async function connectDB() {
  try {
    console.log("connecting to DB...");
    await mongoose.connect(process.env.DB_URL);
    console.log("DB Connected");
  } catch (error) {
    console.error("Database connection failed", error);
    process.exit(1);
  }
}

export default connectDB;
