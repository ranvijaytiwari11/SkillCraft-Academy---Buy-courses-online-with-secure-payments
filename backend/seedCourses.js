import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { Admin } from "./models/admin.model.js";
import { Course } from "./models/course.model.js";
import config from "./config/config.js";

dotenv.config();

const DB_URI = process.env.MONGO_URI;

const coursesToSeed = [
  // --- PEHLE WALE 6 COURSES ---
  {
    title: "A2Z DSA Course - Beginner to Advanced",
    description: "Master Data Structures and Algorithms from scratch with Striver. Perfect for FAANG interview preparation.",
    price: 4999,
    creator: "Striver (Take U Forward)",
    image: { public_id: "demo_striver_1", url: "/course-images/striver.jpg" }
  },
  {
    title: "Complete C++ with DSA",
    description: "Learn C++ and Data Structures effortlessly with Raghav Garg. Ideal for college students.",
    price: 3999,
    creator: "Raghav Garg (PW Skills)",
    image: { public_id: "demo_raghav_1", url: "/course-images/raghav.jpg" }
  },
  {
    title: "Sigma Web Development Bootcamp",
    description: "Become a Full Stack Web Developer. Learn HTML, CSS, JavaScript, React, and Node.js with Shradha Khapra.",
    price: 5999,
    creator: "Shradha Khapra (Apna College)",
    image: { public_id: "demo_shradha_1", url: "/course-images/shradha.jpg" }
  },
  {
    title: "Supreme DSA Batch - Placement Ready",
    description: "Clear top product-based company interviews with Love Babbar's Supreme DSA strategies.",
    price: 4500,
    creator: "Love Babbar (CodeHelp)",
    image: { public_id: "demo_love_1", url: "/course-images/love.jpg" }
  },
  {
    title: "100xDevs: Full Stack & Web3 Cohort",
    description: "Go from absolute zero to earning as a MERN & Web3 Developer with Harkirat Singh.",
    price: 6999,
    creator: "Harkirat Singh",
    image: { public_id: "demo_harkirat_1", url: "/course-images/harkirat.jpg" }
  },
  {
    title: "Chai aur React - Complete Series",
    description: "Understand React.js deeply with real-world projects, taught in pure Hindi by Hitesh.",
    price: 2999,
    creator: "Hitesh Choudhary",
    image: { public_id: "demo_hitesh_1", url: "/course-images/hitesh.jpg" }
  },

  // --- NAYE 5 COURSES ---
  {
    title: "100 Days of Code: Complete Python Developer",
    description: "Master Python from pure basics to advanced applications, data science, and web scripting.",
    price: 3499,
    creator: "Harry (CodeWithHarry)",
    image: { public_id: "demo_harry_1", url: "/course-images/harry.jpg" }
  },
  {
    title: "Java Placement Course + DSA",
    description: "The complete guide to Java programming and logic building for cracking campus placements.",
    price: 3999,
    creator: "Anuj Bhaiya",
    image: { public_id: "demo_anuj_1", url: "/course-images/anuj.jpg" }
  },
  {
    title: "Complete DevOps & Cloud Computing",
    description: "Learn Linux, Docker, Kubernetes, AWS, and CI/CD pipelines from scratch. Become a DevOps Engineer.",
    price: 7999,
    creator: "Kunal Kushwaha",
    image: { public_id: "demo_kunal_1", url: "/course-images/kunal.jpg" }
  },
  {
    title: "Mastering Competitive Programming",
    description: "Elevate your problem-solving skills to crack Codeforces, CodeChef, and FAANG interviews.",
    price: 4999,
    creator: "Nishant Chahar",
    image: { public_id: "demo_nishant_1", url: "/course-images/nishant.jpg" }
  },
  {
    title: "C Language & Logic Building",
    description: "The most robust foundational computer science course starting entirely from scratch in Hindi.",
    price: 2499,
    creator: "Saurabh Shukla",
    image: { public_id: "demo_saurabh_1", url: "/course-images/saurabh.jpg" }
  },
  // --- NAYE 4 COURSES ---
  {
    title: "Namaste JavaScript - Advanced Concepts",
    description: "Deep dive into JS Execution Context, Hoisting, and Closures to crack top product companies.",
    price: 1999,
    creator: "Akshay Saini",
    image: { public_id: "demo_akshay", url: "/course-images/akshay.jpg" }
  },
  {
    title: "Full Stack Next.js & Prisma Masterclass",
    description: "Build production-level server-side rendered applications with the latest Next.js App Router.",
    price: 3499,
    creator: "Piyush Garg",
    image: { public_id: "demo_piyush", url: "/course-images/piyush.jpg" }
  },
  {
    title: "MERN Stack Complete Series logically",
    description: "Step-by-step MERN stack tutorials with real-world mini projects in a fun, easy way.",
    price: 2500,
    creator: "Thapa Technical",
    image: { public_id: "demo_thapa", url: "/course-images/thapa.jpg" }
  },
  {
    title: "Java Programming & Spring Boot",
    description: "Master Java basics to advanced framework integration with the world's most trusted faculty.",
    price: 4999,
    creator: "Navin Reddy (Telusko)",
    image: { public_id: "demo_telusko", url: "/course-images/telusko.jpg" }
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log("✅ MongoDB connected for seeding");

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

    // THIS IS THE CRITICAL FIX: Flush the old broken images out completely!
    await Course.deleteMany({});
    console.log("🧹 Flushed all old broken courses from database.");

    const newCourses = coursesToSeed.map((course) => ({
      ...course,
      creatorId: admin._id,
    }));

    await Course.insertMany(newCourses);
    console.log("✅ 11 local-image courses seeded successfully!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();
