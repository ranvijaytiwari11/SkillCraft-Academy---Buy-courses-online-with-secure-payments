import React, { useEffect, useState, useRef } from "react";
import logo from "../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaGithub,
  FaUserCircle,
  FaSearch
} from "react-icons/fa";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../../frontend-config/api";
import { motion, AnimatePresence } from "framer-motion";

function Home() {
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [loadingPurchased, setLoadingPurchased] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const profileRef = useRef();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.user) {
      setUser({ ...storedUser.user, token: storedUser.token });
    }
  }, []);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/course/courses`, { withCredentials: true })
      .then((res) => setCourses(Array.isArray(res.data.courses) ? res.data.courses : []))
      .catch((err) => console.error("Error fetching courses:", err));
  }, []);

  useEffect(() => {
    const fetchPurchased = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser?.token) {
        setLoadingPurchased(false);
        return;
      }
      try {
        const res = await axios.get(`${BACKEND_URL}/purchase/all`, {
          headers: { Authorization: `Bearer ${storedUser.token}` },
          withCredentials: true,
        });
        setPurchasedCourses(res.data.purchasedCourses || []);
      } catch (err) {
        console.error("Error fetching purchased courses:", err);
      } finally {
        setLoadingPurchased(false);
      }
    };
    fetchPurchased();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `${BACKEND_URL}/user/logout`,
        {},
        { withCredentials: true }
      );
      toast.success(res.data.message);
      localStorage.removeItem("user");
      setUser(null);
    } catch (err) {
      toast.error(err.response?.data?.errors || "Logout failed");
    }
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    arrows: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  // Live filter
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fadeInReveal = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const CourseCard = ({ course }) => {
    const purchasedCourseIds = purchasedCourses.map((item) => item.courseId || item._id);
    const isPurchased = purchasedCourseIds.includes(course._id);

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="glass-panel rounded-2xl overflow-hidden hover:scale-105 hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all duration-300 flex flex-col h-full"
      >
        <img
          src={course.image?.url}
          alt={course.title}
          className="h-48 w-full object-cover bg-white"
        />
        <div className="p-5 flex flex-col flex-grow text-center">
          <h3 className="text-lg font-semibold mb-3 text-white line-clamp-2">
            {course.title}
          </h3>
          <div className="mt-auto">
            {loadingPurchased ? (
              <button
                disabled
                className="bg-gray-600 text-white text-sm px-5 py-2.5 rounded-full cursor-wait w-full"
              >
                Checking...
              </button>
            ) : isPurchased ? (
              <button
                onClick={() => navigate("/purchases")}
                className="bg-green-500 text-white text-sm px-5 py-2.5 rounded-full shadow-lg hover:bg-green-600 transition w-full font-semibold"
              >
                Enrolled
              </button>
            ) : (
              <Link
                to={`/buy/${course._id}`}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm px-5 py-2.5 rounded-full shadow-lg hover:shadow-orange-500/50 transition w-full inline-block font-semibold"
              >
                Enroll Now
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen text-white font-inter overflow-x-hidden relative">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-orange-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-6 max-w-7xl relative z-10">
        {/* Header */}
        <header className="sticky top-4 z-50 glass-header rounded-2xl p-4 flex flex-wrap justify-between items-center gap-4 shadow-2xl">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-white/10 p-1 rounded-full border border-white/20 group-hover:border-orange-500/50 transition duration-300">
               <img src={logo} alt="logo" className="w-8 h-8 rounded-full" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
              SkillCraft
            </h1>
          </Link>

          <div className="flex items-center gap-4 relative">
            {user ? (
              <div className="relative flex items-center gap-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowProfile((prev) => !prev);
                  }}
                  className="cursor-pointer hover:scale-105 transition"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Avatar"
                      className="h-10 w-10 rounded-full object-cover border-2 border-orange-500/50 shadow-lg"
                    />
                  ) : (
                    <FaUserCircle className="text-4xl text-orange-400 drop-shadow-md" />
                  )}
                </button>

                {showProfile && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    ref={profileRef}
                    className="absolute top-14 right-0 w-72 glass-panel text-white rounded-2xl p-5 z-50 shadow-2xl border border-white/10"
                  >
                    <div className="flex flex-col items-center">
                      <img
                         src={user.avatar || ""}
                         alt="Avatar"
                         className="h-20 w-20 rounded-full object-cover border-4 border-orange-500 mb-3 shadow-lg"
                      />
                      <h3 className="text-lg font-semibold">
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className="text-sm text-gray-300">{user.email}</p>
                      <Link
                        to="/user/setting"
                        className="mt-5 w-full text-center text-sm font-medium bg-white/10 border border-white/20 px-4 py-2 rounded-xl hover:bg-white/20 transition"
                      >
                        Update Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="mt-3 w-full text-center text-sm font-medium bg-red-500/80 border border-red-500/50 px-4 py-2 rounded-xl hover:bg-red-500 transition shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                      >
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/login"
                  className="bg-white/10 text-white backdrop-blur-sm border border-white/20 font-medium px-6 py-2 rounded-full hover:bg-white/20 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium px-6 py-2 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.4)] hover:shadow-[0_0_25px_rgba(249,115,22,0.6)] transition-all"
                >
                  Signup
                </Link>
              </div>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <motion.section 
          initial="hidden" 
          animate="visible" 
          variants={fadeInReveal} 
          className="text-center mt-24 sm:mt-32 max-w-4xl mx-auto px-4"
        >
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium">
            🚀 The ultimate learning platform
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            Level up your skills with <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 text-glow">SkillCraft</span>
          </h1>
          <p className="text-gray-300 mt-4 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Upskill, Reskill & Grow with the best curated online courses. Designed for creators, developers, and visionaries.
          </p>
          
          {/* Animated Search Bar within Hero */}
          <div className="mt-10 relative max-w-2xl mx-auto">
            <div className="glass-panel p-2 rounded-full flex items-center shadow-lg">
              <FaSearch className="text-gray-400 ml-4 text-xl" />
              <input
                type="text"
                placeholder="Search for a course to start learning..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-white px-4 py-3 w-full placeholder-gray-400 text-lg"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")} 
                  className="mr-4 text-gray-400 hover:text-white transition bg-white/10 rounded-full px-3 py-1 text-sm font-semibold"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </motion.section>

        {/* Courses Section */}
        <motion.section 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInReveal} 
          className="mt-24 sm:mt-32"
        >
          <div className="flex justify-between items-center mb-8 px-2">
             <h2 className="text-3xl font-bold text-white">
               {searchQuery ? `Search Results for "${searchQuery}"` : "Popular Courses"}
             </h2>
             <Link to="/courses" className="text-orange-400 hover:text-orange-300 font-medium transition">
               View All →
             </Link>
          </div>

          <div className="relative overflow-visible">
            {searchQuery ? (
              filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-2">
                  <AnimatePresence>
                    {filteredCourses.map((course) => (
                      <CourseCard key={course._id} course={course} />
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="glass-panel p-10 text-center rounded-2xl w-full">
                   <p className="text-xl text-gray-300">No courses found matching your query.</p>
                </div>
              )
            ) : (
              <div className="px-2">
                <Slider {...settings}>
                  {Array.isArray(courses) &&
                    courses.map((course) => (
                      <div key={course._id} className="px-3 pb-8">
                        <CourseCard course={course} />
                      </div>
                    ))}
                </Slider>
              </div>
            )}
          </div>
        </motion.section>

        {/* Why Choose Section */}
        <motion.section 
           initial="hidden" 
           whileInView="visible" 
           viewport={{ once: true, margin: "-100px" }}
           variants={fadeInReveal} 
           className="mt-32 text-center max-w-6xl mx-auto px-4"
        >
          <h2 className="text-4xl font-bold text-white mb-12">Why Choose SkillCraft?</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { title: "Expert Instructors", desc: "Top educators with real-world experience bringing you the best insights.", icon: "👨‍🏫" },
              { title: "Flexible Learning", desc: "Self-paced learning with lifetime access anytime, anywhere.", icon: "🌐" },
              { title: "Certification", desc: "Get certified and boost your resume to land your dream job.", icon: "🏆" }
            ].map((item, index) => (
              <div key={index} className="glass-panel p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300 text-left relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 text-7xl opacity-10 group-hover:opacity-20 transition-opacity">
                  {item.icon}
                </div>
                <div className="text-4xl mb-6">{item.icon}</div>
                <h4 className="font-bold text-white text-xl mb-3">{item.title}</h4>
                <p className="text-gray-400 leading-relaxed relative z-10">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Policy Sections */}
        <motion.section 
           initial="hidden" 
           whileInView="visible" 
           viewport={{ once: true, margin: "-100px" }}
           variants={fadeInReveal} 
           className="mt-32 space-y-6 max-w-5xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center mb-10 text-white">Important Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "Contact Us", path: "/contact-us", desc: "For any inquiries, feel free to reach us." },
              { title: "Privacy Policy", path: "/privacy-policy", desc: "Read how we handle your data responsibly." },
              { title: "Refund Policy", path: "/refund-policy", desc: "Read about our hassle-free refund process." },
              { title: "Shipping Policy", path: "/shipping-policy", desc: "Learn about delivery and coverage." },
              { title: "Terms & Conditions", path: "/terms-and-conditions", desc: "Read our rules before using our services." }
            ].map((item, index) => (
              <div 
                key={index} 
                className="glass-panel p-8 rounded-2xl cursor-pointer hover:bg-white/5 transition flex flex-col justify-between" 
                onClick={() => navigate(item.path)}
              >
                <div>
                  <h3 className="text-xl font-bold text-orange-400 mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
                <div className="mt-4 flex justify-end">
                  <span className="text-white/30 group-hover:text-white transition">→</span>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 1 }}
           className="mt-32 border-t border-white/10 pt-16 pb-8 text-sm text-gray-400 grid grid-cols-1 md:grid-cols-4 gap-10"
        >
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img src={logo} alt="logo" className="w-8 h-8 rounded-full" />
              <h1 className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 font-bold">SkillCraft</h1>
            </div>
            <p className="text-gray-400 max-w-sm mb-6 leading-relaxed">
              Empowering learners worldwide with state-of-the-art educational content tailored for success in the dynamic tech industry.
            </p>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-white/5 p-3 rounded-full hover:bg-white/10 hover:text-blue-500 transition"><FaFacebook className="text-xl" /></a>
              <a href="https://instagram.com/ranvijayt11" target="_blank" rel="noopener noreferrer" className="bg-white/5 p-3 rounded-full hover:bg-white/10 hover:text-pink-500 transition"><FaInstagram className="text-xl" /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="bg-white/5 p-3 rounded-full hover:bg-white/10 hover:text-blue-400 transition"><FaTwitter className="text-xl" /></a>
              <a href="https://github.com/ranvijaytiwari11" target="_blank" rel="noopener noreferrer" className="bg-white/5 p-3 rounded-full hover:bg-white/10 hover:text-white transition"><FaGithub className="text-xl" /></a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Connect Developer</h3>
            <ul className="space-y-3">
              <li><span className="text-gray-500">Name:</span> <span className="text-gray-300">Ranvijay Tiwari</span></li>
              <li><span className="text-gray-500">Email:</span> <span className="text-orange-400">rt7999675@gmail.com</span></li>
              <li><span className="text-gray-500">Telegram:</span> <span className="text-blue-400">@Ranvijay_11</span></li>
              <li><span className="text-gray-500">GitHub:</span> <span className="text-gray-300">ranvijaytiwari11</span></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Legal</h3>
            <ul className="space-y-3">
               <li><span className="text-gray-500">© 2026 SkillSphere</span></li>
               <li><span className="text-gray-500">All rights reserved.</span></li>
               <li><span className="text-gray-500">Designed with passion.</span></li>
            </ul>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}

export default Home;
