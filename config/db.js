import mongoose from "mongoose";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const addIpToAtlas = async () => {
  try {
    const ip = await axios.get("https://ifconfig.me").then(res => res.data);

    await axios.post(
      `https://cloud.mongodb.com/api/atlas/v1.0/groups/${process.env.ATLAS_GROUP_ID}/accessList`,
      [{ ipAddress: ip, comment: "Auto-added IP from dynamic server" }],
      {
        auth: {
          username: process.env.ATLAS_PUBLIC_KEY,
          password: process.env.ATLAS_PRIVATE_KEY,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`✅ IP ${ip} ajoutée à la whitelist Atlas`);
  } catch (err) {
    console.error("❌ Impossible d'ajouter l'IP à Atlas :", err.response?.data || err.message);
    throw err;
  }
};

const connectDB = async () => {
  try {
    await addIpToAtlas(); 
    const conn = await mongoose.connect(process.env.MONGO_URI); 
    console.log(`✅ MongoDB connecté : ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ Erreur de connexion MongoDB :", error.message);
    process.exit(1);
  }
};

export default connectDB;
