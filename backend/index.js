import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import config from "./config/config.js";

import cookieParser from "cookie-parser";
import courseRoute from "./routes/course.route.js";
import userRoute from "./routes/user.route.js";
import adminRoute from "./routes/admin.route.js";
import orderRoute from "./routes/order.route.js";
import purchaseRoute from "./routes/purchase.route.js";
import cors from "cors";

// Load environment variables
dotenv.config();
const app = express();
const DB_URI = process.env.MONGO_URI;

// -> Mounting core application middlewares
app.use(cookieParser());
app.use(express.json());

// -> Establishing database connection prior to server bootstrap
let cachedDb = false;
const connectDB = async () => {
  if (cachedDb) return;
  try {
    await mongoose.connect(DB_URI);
    cachedDb = true;
    console.log("-> MongoDB connectivity established");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
};

// Ensure DB is connected BEFORE handling any API requests
app.use(async (req, res, next) => {
  await connectDB();
  next();
});
const allowedOrigins = [
  config.FRONTEND_URL, // From environment variables
  "https://course-selling-app-sage.vercel.app", // your current frontend
  "http://localhost:5173", // local dev
  "http://localhost:5174",
  "http://localhost:5175",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/", (req, res) => {
  res.send("Welcome to the SkillSphere API!");
});

app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});
// -> Initializing operational route modules
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/order", orderRoute);  
app.use("/api/v1/purchase", purchaseRoute);
 
// Only listen locally if not deployed on Vercel
if (process.env.NODE_ENV !== "production") {
  app.listen(config.PORT, () => {
    console.log(`Server running on http://localhost:${config.PORT}`);
  });
}

// Export the Express API for Vercel
export default app;
