import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const corsMiddleware = cors({
  origin: process.env.CORS_ORIGIN, 
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
});

export default corsMiddleware;
