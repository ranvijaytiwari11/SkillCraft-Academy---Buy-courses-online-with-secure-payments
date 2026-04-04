import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { BACKEND_URL } from "./frontend-config/api";

// -> Public and authenticated user interfaces
import Home from "./components/User/home";
import Login from "./components/User/login";
import SignUp from "./components/User/signup";
import ChatbotWidget from "./components/User/ChatbotWidget";

import Courses from "./components/User/courses";
import CourseDetail from "./components/User/CourseDetail";
import Buy from "./components/User/buy";
import Purchases from "./components/User/purchases";
import Settings from "./components/User/setting";
import ForgotPassword from "./components/User/forgotPassWord";
import ResetPassword from "./components/User/ResetPassword";
import VerifyOtp from "./components/User/verifyOtp";

// -> Static informational and policy portals
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import RefundPolicy from "./pages/RefundPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import ContactUs from "./pages/ContactUs";

// -> Elevated administration modules
import AdminHome from "./components/Admin/AdminHome";
import AdminProfile from "./components/Admin/AdminProfile";
import AdminLogin from "./components/Admin/AdminLogin";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AdminCreateCourse from "./components/Admin/AdminCreateCourse";
import AdminUpdateCourse from "./components/Admin/AdminUpdateCourse";
import AdminCourseList from "./components/Admin/AdminCourseList";
import AdminPrivateRoute from "./components/Protected/AdminPrivateRoute";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // -> Orchestrating automatic administration logout to prevent session overlaps
  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem("admin"));
    const isAdminRoute = location.pathname.startsWith("/admin");
    if (admin?.token && !isAdminRoute) {
      axios.post(`${BACKEND_URL}/admin/logout`, {}, { withCredentials: true })
        .then(() => {
          localStorage.removeItem("admin");
          console.log("✅ Admin auto-logged out");
        })
        .catch((err) => {
          console.error("⚠️ Admin auto logout failed", err);
        });
    }
  }, [location.pathname]);

  return (
    <>
      <Routes>
        {/* -> Standard identity routing */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />

        {/* -> Institutional policy endpoints */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/contact-us" element={<ContactUs />} />

        
        
          <Route path="/courses" element={<Courses />} />
          <Route path="/buy/:courseId" element={<Buy />} />
          <Route path="/purchases" element={<Purchases />} />
          <Route path="/course/:courseId" element={<CourseDetail />} />
          <Route path="/user/setting" element={<Settings />} />
        

        {/* 🔐 Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* -> Elevated administration portals */}
        <Route path="/admin" element={<AdminPrivateRoute />}>
          <Route index element={<AdminHome />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="create" element={<AdminCreateCourse />} />
          <Route path="update/:courseId" element={<AdminUpdateCourse />} />
          <Route path="courses" element={<AdminCourseList />} />
        </Route>
      </Routes>

      <ChatbotWidget />
      <Toaster />
    </>
  );
}

export default App;
