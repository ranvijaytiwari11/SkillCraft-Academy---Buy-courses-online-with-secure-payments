<div align="center">
  <h1>🚀 SkillCraft Academy</h1>
  <p><h3>Premium EdTech Platform with Cryptographically Secure Payments</h3></p>

  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
</div>
<br/>
## 🌐 Live Demo

🚀 https://your-link.vercel.app
<br/>
Welcome to **SkillCraft**, an enterprise-grade online course platform engineered with the MERN stack. Designed for maximum reliability and aesthetics, SkillCraft empowers users to seamlessly discover, purchase, and review curated upskilling courses while experiencing an immersive, glassmorphism-inspired interface.

---

## ✨ Enterprise Features

- 🔐 **Cryptographic Verification Pipeline:** Payments are secured using the Razorpay API, backed by server-side HMAC SHA-256 signature verification to prevent spoofed/hijacked transactions.
- 🎨 **Premium UI/UX System:** A meticulously crafted dark-theme aesthetic powered by **Tailwind CSS** and **Framer Motion**, delivering fluid transitions and responsive spatial layouts.
- 🖼️ **Robust Asset Rendering:** Dual-layer image infrastructure. Relies natively on Cloudinary CDN for dynamic uploads, backed by a robust deterministic local disk-fallback architecture.
- 🛡️ **Role-Based Access Control (RBAC):** Distinct and secure routing layers managed by localized JWT stateless token guards for normal Users vs. Administrators.
- 💳 **Zero-Friction Checkout:** Beautiful integrated client-side checkout modal eliminating redirections and increasing conversion probability.

---

## 🛠️ System Architecture

| Layer | Technology Used | Functionality |
| :--- | :--- | :--- |
| **Frontend** | React (Vite), Tailwind, Framer Motion | Constructs the responsive SPA, manages visual state representations, and handles client routing. |
| **Backend** | Node.js, Express.js | Exposes the RESTful API matrix, oversees middleware verification, and coordinates external webhooks. |
| **Database** | MongoDB (Mongoose) | Provides highly scalable NoSQL persistent state management for Users, Purchases, and Courses. |
| **Security** | JWT, bcryptjs, Node Crypto | Governs stateless authentication flows and cryptographic payment validity. |
| **Gateways** | Razorpay SDK, Cloudinary API | Handles absolute financial transactions and distributed media asset delivery. |

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed to run this application locally:
- **Node.js** (v18.x or higher)
- **MongoDB** (Local instance or Atlas cluster URI)
- **Razorpay API Keys** (Key ID & Secret)
- **Cloudinary Account** (For dynamic image uploads)

### Installation Guide

**1. Clone the repository natively:**
```bash
git clone https://github.com/RanvijayTiwari11/SkillCraft.git
cd SkillCraft
```

**2. Hydrate workspace dependencies:**
*(This project relies on separated frontend/backend contexts)*
```bash
cd backend && npm install
cd ../frontend && npm install
```

**3. Inject Environment Variables:**
Create a `.env` file within the `/backend` directory matching the following configuration map:

```env
PORT=8001
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string

# Cryptographic Token Secrets
JWT_USER_PASSWORD=your_user_jwt_secret
JWT_ADMIN_PASSWORD=your_admin_jwt_secret

# Asset Management System
CLOUD_NAME=your_cloudinary_name
API_KEY=your_cloudinary_key
API_SECRET=your_cloudinary_secret

# Financial Gateway
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Communication Hub (Nodemailer config)
EMAIL_FROM=your_email@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:5173
```

**4. Spin up the Development Environment:**
You will need two active terminal bounds to serve both the matrix endpoint and the client.

**Terminal 1 (Backend API):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend Client):**
```bash
cd frontend
npm run dev
```

**5. Initialization Check:**
Open your browser and navigate to the printed Vite local address (typically `http://localhost:5173`).

---

## 📞 Administrator & Developer Contact

Built and maintained by **Ranvijay Tiwari**  
For business inquiries, project deployments, or developer consulting:

- 📱 **Phone:** +91 9305246463
- 📧 **Email:** rt7999675@gmail.com
- 📺 **YouTube Code Breakdowns:** [@RanvijayTiwari-f5w](https://www.youtube.com/@RanvijayTiwari-f5w)

---
*© 2026 SkillCraft Academy. All Rights Reserved.*
