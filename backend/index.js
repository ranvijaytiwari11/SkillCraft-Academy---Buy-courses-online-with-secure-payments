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

const allowedOrigins = [
  config.FRONTEND_URL, // From environment variables
  "https://skill-craft-academy-buy-courses-onl-kappa.vercel.app", // your current frontend
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


// -> Establishing database connection prior to server bootstrap
const startServer = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log("-> MongoDB connectivity established");

    app.listen(config.PORT, () => {
      console.log(`Server running on http://localhost:${config.PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

startServer();
