import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    if (process.env.NODE_ENV !== "production") {
      console.log(`✅ MongoDB connecté : ${conn.connection.host}`);
    }
  } catch (error) {
    console.error("❌ Erreur MongoDB :", error);
    process.exit(1);
  }
};

export default connectDB;


