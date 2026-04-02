# SkillCraft 🚀

Welcome to **SkillCraft**, a premium online course platform built with the MERN stack (MongoDB, Express, React, Node.js). SkillCraft allows users to discover, enroll in, and review curated upskilling courses while providing a seamless glassmorphism-inspired user interface.

## ✨ Features
- **User Authentication:** Secure JWT-based signup and login system.
- **Premium UI/UX:** Built with Tailwind CSS and Framer Motion for smooth animations and a responsive, modern dark-mode aesthetic.
- **Course Marketplace:** Browse courses with details, price, and placeholder imagery.
- **Payment Integration:** Secure checkout flow integrated dynamically using Razorpay.
- **User Dashboard:** A dedicated space showing purchased courses and settings.

## 🛠️ Technology Stack
- **Frontend:** React (Vite), Tailwind CSS, Framer Motion, React-Router-DOM, React-Hot-Toast
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (with Mongoose)
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **Payment Gateway:** Razorpay
- **Image Hosting:** Cloudinary

## 🚀 Getting Started

### Prerequisites
- Node.js installed on your machine
- A MongoDB cluster/local instance
- Razorpay API credentials

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/RanvijayTiwari11/SkillCraft.git
   cd SkillCraft
   ```

2. **Install all dependencies:**
   Run the following command at the root to install both backend and frontend dependencies:
   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the `backend/` directory and configure the following variables:
   ```env
   PORT=8001
   NODE_ENV=development
   MONGO_URI=your_mongodb_connection_string
   JWT_USER_PASSWORD=your_jwt_secret
   JWT_ADMIN_PASSWORD=your_admin_jwt_secret
   CLOUD_NAME=your_cloudinary_name
   API_KEY=your_cloudinary_key
   API_SECRET=your_cloudinary_secret
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   EMAIL_FROM=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   FRONTEND_URL=http://localhost:5173
   ```

4. **Run the Application:**

   **Start the Backend:**
   ```bash
   cd backend
   npm run dev
   ```

   **Start the Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

5. **Open in Browser:** 
   Navigate to `http://localhost:5173/` in your browser!

## 📞 Contact
- **Developer:** Ranvijay Tiwari
- **Phone:** 9305246463
- **Email:** rt7999675@gmail.com
- **YouTube:** [@RanvijayTiwari-f5w](https://www.youtube.com/@RanvijayTiwari-f5w)

---
*© 2026 SkillCraft. Designed by Ranvijay Tiwari. All rights reserved.*
