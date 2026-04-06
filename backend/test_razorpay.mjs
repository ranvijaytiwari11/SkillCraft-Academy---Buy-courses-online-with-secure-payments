import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function testRazorpay() {
  try {
    // Attempt to fetch all orders (with count 1) to verify connectivity and credentials
    const orders = await razorpay.orders.all({ count: 1 });
    console.log("✅ Razorpay connection successful!");
    console.log("Keys are perfectly valid. Order fetch test passed.");
  } catch (error) {
    console.error("❌ Razorpay connection failed!");
    console.error(error);
  }
}

testRazorpay();
