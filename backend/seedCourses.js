import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { Admin } from "./models/admin.model.js";
import { Course } from "./models/course.model.js";
import config from "./config/config.js";

dotenv.config();

const DB_URI = process.env.MONGO_URI;

const coursesToSeed = [
  {
    title: "Mastering React: From Beginner to Pro",
    description: "A comprehensive guide to React.js, focusing on hooks, context, and state management.",
    price: 499,
    image: {
      public_id: "react_course_img",
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1024px-React-icon.svg.png",
    },
  },
  {
    title: "Full Stack Web Development with MERN",
    description: "Learn how to build powerful full stack applications using MongoDB, Express, React, and Node.js.",
    price: 999,
    image: {
      public_id: "mern_course_img",
      url: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg",
    },
  },
  {
    title: "Advanced JavaScript Concepts",
    description: "Dive deep into closures, prototypes, async/await, and event loops.",
    price: 299,
    image: {
      public_id: "js_course_img",
      url: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png",
    },
  },
  {
    title: "Python for Data Science and Machine Learning",
    description: "Complete guide to learning Python with Pandas, NumPy, and Scikit-Learn.",
    price: 799,
    image: {
      public_id: "python_course_img",
      url: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
    },
  },
  {
    title: "Introduction to UI/UX Design",
    description: "Master the fundamentals of UI/UX design using Figma and modern design principles.",
    price: 399,
    image: {
      public_id: "uiux_course_img",
      url: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",
    },
  },
  {
    title: "AWS Cloud Practitioner Bootcamp",
    description: "Prepare for your AWS Certified Cloud Practitioner exam with real-world scenarios.",
    price: 599,
    image: {
      public_id: "aws_course_img",
      url: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
    },
  },
  {
    title: "Docker & Kubernetes for DevOps",
    description: "Learn containerization and orchestration to streamline your CI/CD pipelines.",
    price: 899,
    image: {
      public_id: "docker_course_img",
      url: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Docker_%28container_engine%29_logo.svg",
    },
  },
  {
    title: "Cybersecurity Bootcamp: Ethical Hacking",
    description: "Learn penetration testing, network security, and practical ethical hacking techniques.",
    price: 1099,
    image: {
      public_id: "cybersec_course_img",
      url: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Computer_security_icon.svg",
    },
  },
  {
    title: "Go Programming Language (Golang) Course",
    description: "Build fast, reliable, and efficient software at scale with Go.",
    price: 699,
    image: {
      public_id: "golang_course_img",
      url: "https://upload.wikimedia.org/wikipedia/commons/0/05/Go_Logo_Blue.svg",
    },
  },
  {
    title: "Mastering Next.js for Production",
    description: "Take your React skills to the next level with server-side rendering, routing, and APIs in Next.js.",
    price: 899,
    image: {
      public_id: "nextjs_course_img",
      url: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Nextjs-logo.svg",
    },
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log("✅ MongoDB connected for seeding");

    // 1. Create or Find Admin
    let admin = await Admin.findOne({ email: "rt7999675@gmail.com" });
    if (!admin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      admin = await Admin.create({
        firstName: "Ranvijay",
        lastName: "Tiwari",
        email: "rt7999675@gmail.com",
        password: hashedPassword,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ranvijay",
      });
      console.log("✅ Admin account created: rt7999675@gmail.com / admin123");
    } else {
      console.log("✅ Using existing Admin account:", admin.email);
    }

    // 2. Clear existing dummy courses if any (Optional, but let's just insert new ones)
    // await Course.deleteMany({});
    
    // 3. Seed Courses
    const newCourses = coursesToSeed.map((course) => ({
      ...course,
      creatorId: admin._id,
    }));

    await Course.insertMany(newCourses);
    console.log("✅ 10 courses seeded successfully");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();
