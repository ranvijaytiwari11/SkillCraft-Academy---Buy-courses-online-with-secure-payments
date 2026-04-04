// routes/order.route.js
import express from "express";
import razorpay from "../utils/razorpay.js";
import Order from "../models/order.model.js";
import userMiddleware from "../middleware/user.mid.js";
import { verifyPayment } from "../controllers/order.controller.js";

const router = express.Router();

// ✅ CREATE ORDER
// Initializes a new Razorpay payment session
router.post("/create", userMiddleware, async (req, res) => {
  const { courseId, amount } = req.body;
  const userId = req.userId;

  try {
    // Configures the order amount (Razorpay requires smallest currency unit - paise)
    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100, 
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    // Commits the pending order details securely to the database
    await Order.create({
      courseId,
      userId,
      amount,
      razorpayOrderId: razorpayOrder.id,
      status: "created",
    });

    // Dispatches the secure keys and Order ID to the client interface
    res.status(200).json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Order creation failed", error);
    res.status(500).json({ error: "Order creation failed" });
  }
});

// ✅ VERIFY PAYMENT
// Verifies the incoming cryptographic signature to prevent spoofing
router.post("/verify", userMiddleware, verifyPayment);

export default router;

