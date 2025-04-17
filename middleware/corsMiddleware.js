import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const corsMiddleware = cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
});

export default corsMiddleware;
