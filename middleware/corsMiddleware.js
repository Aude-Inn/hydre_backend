import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const corsMiddleware = cors({
  origin: (origin, callback) => {
    console.log("Requête provenant de :", origin)
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://hydre-frontend.vercel.app',
      'https://hydre-backend.onrender.com',
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn("CORS refusé pour :", origin); 
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

export default corsMiddleware;
