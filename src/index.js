import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import teamMemberRoutes from "./routes/teamMemberRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
//Commented out old CORS config that allows all origins without credentials
// app.use(cors({
//   origin: ["null", "*"]
// }));

// Updated CORS to allow specific origins and enable credentials for cookie auth
app.use(cors({
  origin: ["http://localhost:3001","http://localhost:3000", "https://webiste-aws.vercel.app","https://website-frontend-lkns.onrender.com","https://awscloudclubpict.vercel.app"],
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

const MONGO_URI ="mongodb+srv://redeem_user:Redeem123@cluster0.psm60jr.mongodb.net/redeemr?retryWrites=true&w=majority&appName=Cluster0";
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    // Don't throw error in serverless environment
  }
};

app.use("/iamatharva", (req, res) => {
  res.json({ message: "API is running!", status: "success" });
});

// Simple test endpoint without database
app.use("/test", (req, res) => {
  res.json({ message: "Test endpoint working!", timestamp: new Date().toISOString() });
});
app.use("/auth", authRoutes);
app.use("/events", eventRoutes);
app.use("/blogs", blogRoutes);
app.use("/team-members", teamMemberRoutes);

// Connect to database on startup
connectToDatabase();

// Removed authMiddleware from profile route as requested
app.get("/profile", (req, res) => {
  res.json({ message: "Profile endpoint - auth middleware removed" });
});

// ✅ For local development, uncomment the following lines:
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log('Server running on http://localhost:',PORT);
});

// ✅ For Vercel deployment, export app
export default app;