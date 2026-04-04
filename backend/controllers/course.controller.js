import { Course } from "../models/course.model.js";
import cloudinary from "../config/cloudinary.js";

import streamifier from "streamifier";
import { Purchase } from "../models/purchase.model.js";
import Order from "../models/order.model.js";
import Razorpay from "razorpay";


if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error("Razorpay keys are missing in environment variables");
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// -> Instantiates new course entity and syncs assets directly to Cloudinary CDN
export const createCourse = async (req, res) => {
  const adminId = req.adminId;
  const { title, description, price, imageUrl } = req.body;

  try {
    if (!title || !description || !price) {
      return res.status(400).json({ errors: "All fields are required" });
    }

    let finalImageUrl = "";
    let finalPublicId = "";

    if (imageUrl) {
      finalImageUrl = imageUrl;
      finalPublicId = "url";
    } else if (req.file) {
      if (!req.file.mimetype.startsWith("image/")) {
        return res.status(400).json({ errors: "Only image files allowed" });
      }

      const streamUpload = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "courses" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });

      const uploadedImage = await streamUpload();
      finalPublicId = uploadedImage.public_id;
      finalImageUrl = uploadedImage.secure_url;
    } else {
      return res.status(400).json({ errors: "Image file or Image URL is required" });
    }

    const course = await Course.create({
      title,
      description,
      price,
      image: {
        public_id: finalPublicId,
        url: finalImageUrl,
      },
      creatorId: adminId,
    });

    res.status(201).json({ message: "Course created", course });
  } catch (error) {
    console.error("Create course error:", error);
    res.status(500).json({ errors: "Error creating course" });
  }
};

// -> Modifies course metadata and regenerates Cloudinary references if URL updates
export const updateCourse = async (req, res) => {
  const adminId = req.adminId;
  const { courseId } = req.params;
  const { title, description, price, imageUrl } = req.body;

  try {
    const course = await Course.findOne({ _id: courseId, creatorId: adminId });
    if (!course) {
      return res.status(404).json({ errors: "Unauthorized to update course" });
    }

    if (imageUrl) {
      // Direct URL provided - delete old cloudinary image if any, then use URL
      if (course.image?.public_id && course.image.public_id !== "url") {
        await cloudinary.uploader.destroy(course.image.public_id);
      }
      course.image = {
        public_id: "url",
        url: imageUrl,
      };
    } else if (req.file) {
      if (course.image?.public_id && course.image.public_id !== "url") {
        await cloudinary.uploader.destroy(course.image.public_id);
      }

      const streamUpload = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "courses" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });

      const result = await streamUpload();

      course.image = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    course.title = title || course.title;
    course.description = description || course.description;
    course.price = price || course.price;

    await course.save();

    res.status(200).json({ message: "Course updated", course });
  } catch (error) {
    console.error("Update course error:", error);
    res.status(500).json({ errors: "Error updating course" });
  }
};

// -> Retrieves master list of all available global courses
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.status(200).json({ courses });
  } catch (error) {
    console.error("Fetch courses error:", error);
    res.status(500).json({ errors: "Error fetching courses" });
  }
};

// -> Obsolete Razorpay buy course route (Currently handled via Global Order Controller)
export const buyCourses = async (req, res) => {
  console.log("🎯 BUY route hit: real Razorpay order");

  const userId = req.userId;
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ errors: "Course not found" });

    const alreadyPurchased = await Purchase.findOne({ userId, courseId });
    if (alreadyPurchased) {
      return res.status(400).json({ errors: "Already purchased" });
    }

    const amount = course.price;

    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100, // in paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`
    });

    await Order.create({
      courseId,
      userId,
      amount,
      currency: "INR",
      razorpayOrderId: razorpayOrder.id,
      status: "created"
    });

    res.status(200).json({
      orderId: razorpayOrder.id,             // ✅ real Razorpay order ID
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,     // ✅ use real Razorpay key from .env
      course                                 // ✅ also send course
    });
    console.log("🛠️ Razorpay Key:", process.env.RAZORPAY_KEY_ID);


  } catch (error) {
    console.error("Buy course error:", error);
    res.status(500).json({ errors: "Error buying course" });
  }
};

export const deleteCourse = async (req, res) => {
  const adminId = req.adminId;
  const { courseId } = req.params;

  try {
    const course = await Course.findOneAndDelete({ _id: courseId, creatorId: adminId });

    if (!course) {
      return res.status(404).json({ errors: "Unauthorized to delete course" });
    }

    res.status(200).json({ message: "Course deleted" });
  } catch (error) {
    console.error("Delete course error:", error);
    res.status(500).json({ errors: "Error deleting course" });
  }
};
 export const courseDetails = async (req, res) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId)
      .populate("reviews.user", "firstName lastName")
      .lean();

    if (!course) return res.status(404).json({ error: "Course not found" });

    res.status(200).json({ course });
  } catch (error) {
    console.error("Course details error:", error);
    res.status(500).json({ errors: "Error fetching course details" });
  }
};

export const addReview = async (req, res) => {
  const userId = req.userId;
  const { courseId } = req.params;
  const { rating, comment } = req.body;

  try {
    // -> Verifying purchase lineage before accepting ratings
    const hasPurchased = await Purchase.findOne({ userId, courseId });
    if (!hasPurchased) {
      return res.status(403).json({ errors: "You must purchase the course to review it" });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ errors: "Course not found" });

    // -> Evaluating for existing review to preempt duplicates
    const existingReview = course.reviews.find((r) => r.user.toString() === userId);

    if (existingReview) {
      // -> Performing an overwrite for existing review state
      existingReview.rating = rating;
      existingReview.comment = comment;
    } else {
      // -> Injecting new review node into course instance
      course.reviews.push({ user: userId, rating, comment });
    }

    // -> Computing mathematical course rating average in real-time
    const totalRating = course.reviews.reduce((sum, r) => sum + r.rating, 0);
    course.averageRating = totalRating / course.reviews.length;

    await course.save();

    res.status(200).json({ message: existingReview ? "Review updated" : "Review added" });
  } catch (error) {
    console.error("Add Review Error:", error);
    res.status(500).json({ errors: "Server error" });
  }
};

export const getCourseReviews = async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId).populate({
      path: "reviews.user",
      select: "firstName lastName email avatar", // You can choose what to send
    });

    if (!course) {
      return res.status(404).json({ errors: "Course not found" });
    }

    res.status(200).json({ reviews: course.reviews });
  } catch (error) {
    console.error("Error fetching course reviews:", error);
    res.status(500).json({ errors: "Server error" });
  }
};
