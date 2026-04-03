import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaUserCircle, FaDiscourse, FaDownload, FaStar, FaRegStar } from "react-icons/fa";
import { RiHome2Fill } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import { IoLogOut, IoLogIn } from "react-icons/io5";
import { HiMenu, HiX } from "react-icons/hi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../../assets/logo.png";
import { BACKEND_URL } from "../../frontend-config/api";
import { motion, AnimatePresence } from "framer-motion";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseReviews, setCourseReviews] = useState([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const token = userData?.token;
    if (!token) {
      toast.error("Please login as user first");
      navigate("/login");
    } else {
      setUser(userData.user);
      setIsLoggedIn(true);
    }
  }, [navigate]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/course/courses`, { withCredentials: true });
        setCourses(res.data.courses);
      } catch (err) {
        toast.error("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchPurchasedCourses = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("user"));
        const token = userData?.token;
        if (!token) return;
        const res = await axios.get(`${BACKEND_URL}/purchase/all`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setPurchasedCourses(res.data.purchasedCourses || []);
      } catch (err) {
        console.error("Error fetching purchased courses:", err);
      }
    };
    fetchPurchasedCourses();
  }, []);

  const handleAboutCourse = async (course) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/course/${course._id}/reviews`, { withCredentials: true });
      setCourseReviews(res.data.reviews || []);
      setSelectedCourse(course);
      setShowDetailModal(true);
    } catch (err) {
      toast.error("Failed to fetch reviews");
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${BACKEND_URL}/user/logout`, {}, { withCredentials: true });
      toast.success(response.data.message);
      localStorage.removeItem("user");
      navigate("/login", { state: { from: location.pathname } });
      setIsLoggedIn(false);
      setUser(null);
      setShowProfile(false);
    } catch (error) {
      toast.error(error?.response?.data?.errors || "Logout failed");
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleOutsideClick = (e) => {
    if (profileRef.current && !profileRef.current.contains(e.target)) {
      setShowProfile(false);
    }
  };

  useEffect(() => {
    if (showProfile) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showProfile]);

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) =>
          i < fullStars ? <FaStar key={i} className="text-yellow-500" /> : <FaRegStar key={i} className="text-gray-400" />
        )}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen font-inter relative overflow-hidden bg-[#050510] text-gray-100">
      
      {/* Background Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-orange-600/20 blur-[120px]" />
      </div>

      <button
        className="md:hidden fixed top-4 left-4 z-50 text-3xl text-white bg-white/10 backdrop-blur border border-white/20 p-2 rounded-full shadow-lg"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <HiX /> : <HiMenu />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 glass-panel transform transition-transform duration-300 ease-in-out z-40 md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-white/10 p-1 rounded-full border border-white/20">
              <img src={logo} alt="Logo" className="w-8 h-8 rounded-full" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">SkillCraft</span>
          </div>

          <ul className="space-y-3 font-medium">
            <li>
              <Link to="/" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition group">
                <RiHome2Fill className="text-xl text-gray-400 group-hover:text-blue-400 transition" /> Home
              </Link>
            </li>
            <li>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-orange-500/20 to-transparent border-l-4 border-orange-500 text-white">
                <FaDiscourse className="text-xl text-orange-400" /> Courses
              </div>
            </li>
            <li>
              <Link to="/purchases" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition group">
                <FaDownload className="text-xl text-gray-400 group-hover:text-green-400 transition" /> Purchases
              </Link>
            </li>
            <li>
              <Link to="/user/setting" state={{ from: location.pathname }} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition group">
                <IoMdSettings className="text-xl text-gray-400 group-hover:text-purple-400 transition" /> Settings
              </Link>
            </li>
            <li className="mt-8 border-t border-white/10 pt-4">
              {isLoggedIn ? (
                <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/20 text-gray-300 hover:text-red-400 transition">
                  <IoLogOut className="text-xl" /> Logout
                </button>
              ) : (
                <Link to="/login" state={{ from: location.pathname }} className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-500/20 text-gray-300 hover:text-blue-400 transition">
                  <IoLogIn className="text-xl" /> Login
                </Link>
              )}
            </li>
          </ul>
        </div>
      </aside>

      <main className="flex-1 ml-0 md:ml-64 p-6 md:p-10 relative z-10 h-screen overflow-y-auto">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6 glass-panel rounded-2xl p-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Explore Courses</h1>
            <p className="text-gray-400">Find the right course to level up your skills.</p>
          </div>

          <div className="flex items-center w-full lg:w-auto gap-4">
            {/* Live Search */}
            <div className="flex-1 lg:w-80 flex items-center bg-black/40 border border-white/10 rounded-full px-4 py-2 focus-within:border-orange-500 transition shadow-inner">
              <FiSearch className="text-gray-400 text-lg mr-3" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent text-white w-full focus:outline-none placeholder-gray-500"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="text-gray-400 hover:text-white transition ml-2">
                  <HiX />
                </button>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button onClick={() => setShowProfile(!showProfile)} className="flex items-center justify-center cursor-pointer hover:scale-105 transition">
                {user?.avatar ? (
                  <img src={user.avatar} alt="User Avatar" className="h-12 w-12 rounded-full object-cover border-2 border-orange-500/50 shadow-lg" />
                ) : (
                  <FaUserCircle className="text-4xl text-orange-400" />
                )}
              </button>

              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  ref={profileRef}
                  className="absolute top-14 right-0 w-64 p-5 rounded-2xl glass-panel border border-white/10 shadow-2xl z-50 text-white"
                >
                  <div className="flex flex-col items-center">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="mb-3 h-20 w-20 rounded-full object-cover border-4 border-orange-500 shadow-lg" />
                    ) : (
                      <FaUserCircle className="text-6xl text-orange-400 mb-3" />
                    )}
                    <h3 className="text-lg font-bold">{user.firstName} {user.lastName}</h3>
                    <p className="text-sm text-gray-400 mb-5">{user.email}</p>
                    <Link
                      to="/user/setting"
                      className="w-full text-center bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-xl transition"
                    >
                      Edit Profile
                    </Link>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </header>

        {/* Course Grid */}
        <section id="course-results" className="pb-10">
          {loading ? (
            <div className="flex justify-center items-center h-40">
               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              <AnimatePresence>
                {filteredCourses.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full glass-panel p-10 text-center rounded-3xl"
                  >
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-xl text-gray-300 font-semibold">No courses found for "{searchTerm}"</p>
                    <p className="text-gray-500 mt-2">Try adjusting your search terms.</p>
                  </motion.div>
                ) : (
                  filteredCourses.map((course) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      key={course._id}
                      className="glass-panel flex flex-col h-full rounded-2xl overflow-hidden hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(249,115,22,0.2)] transition-all duration-300"
                    >
                      <div className="relative">
                        <img 
                           src={course.image?.url || "https://via.placeholder.com/300"} 
                           alt={course.title} 
                           className="w-full h-48 object-cover bg-white" 
                        />
                        <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                          NEW
                        </div>
                      </div>

                      <div className="p-6 flex flex-col flex-1">
                        <h2 className="font-bold text-xl text-white mb-2 line-clamp-2">{course.title}</h2>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-orange-400 font-bold text-sm">{course.averageRating || 0}</span>
                          {renderStars(course.averageRating || 0)}
                          <span className="text-gray-500 text-xs text-sm">({course.reviews?.length || 0})</span>
                        </div>

                        <p className="text-gray-400 text-sm mb-6 line-clamp-2">{course.description}</p>
                        
                        <div className="mt-auto">
                          <div className="flex items-end gap-3 mb-5">
                            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 text-2xl">
                              ₹{course.price}
                            </span>
                            <span className="line-through text-md text-gray-500 mb-1">₹5999</span>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <button 
                              onClick={() => handleAboutCourse(course)} 
                              className="w-full text-center bg-white/10 border border-white/20 text-white py-2 rounded-xl hover:bg-white/20 transition text-sm font-semibold"
                            >
                              Details
                            </button>
                            {purchasedCourses.includes(course._id.toString()) ? (
                              <Link 
                                to="/purchases" 
                                className="w-full flex items-center justify-center text-center bg-green-500/20 border border-green-500/50 text-green-400 py-2 rounded-xl hover:bg-green-500/30 transition text-sm font-semibold"
                              >
                                Enrolled
                              </Link>
                            ) : (
                              <Link 
                                to={`/buy/${course._id}`} 
                                className="w-full flex items-center justify-center text-center bg-orange-600 border border-orange-500 text-white py-2 rounded-xl hover:bg-orange-500 hover:shadow-[0_0_15px_rgba(249,115,22,0.4)] transition text-sm font-semibold"
                              >
                                Buy Now
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          )}
        </section>
      </main>

      {/* Review/Details Modal */}
      <AnimatePresence>
        {showDetailModal && selectedCourse && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4"
          >
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="glass-panel w-full max-w-2xl bg-gray-900/90 border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] relative flex flex-col max-h-[85vh]"
            >
              <button 
                onClick={() => setShowDetailModal(false)} 
                className="absolute top-4 right-4 text-gray-400 hover:text-white bg-black/20 p-2 rounded-full transition z-10"
              >
                <HiX className="text-xl" />
              </button>
              
              <div className="relative h-64 shrink-0">
                <img src={selectedCourse.image?.url || "https://via.placeholder.com/400x200"} alt="Course" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent flex items-end p-6">
                  <div>
                    <span className="bg-orange-500/20 border border-orange-500/50 text-orange-400 text-xs px-3 py-1 rounded-full mb-3 inline-block font-medium">Bestseller</span>
                    <h2 className="text-3xl font-bold text-white leading-tight">{selectedCourse.title}</h2>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 overflow-y-auto hide-scroll flex-1">
                <div className="flex items-center gap-4 mb-6">
                   <div className="bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-xl">
                      <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">₹{selectedCourse.price}</span>
                      <span className="ml-2 text-sm text-gray-500 line-through">₹5999</span>
                   </div>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-2">Description</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-8">{selectedCourse.description}</p>
                
                <h3 className="text-lg font-bold text-white mb-4">Student Feedback</h3>
                {courseReviews.length === 0 ? (
                  <div className="bg-black/30 border border-white/5 rounded-2xl p-6 text-center">
                    <p className="text-gray-500">No reviews yet. Be the first to review this course!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {courseReviews.map((review, index) => (
                      <div key={index} className="bg-black/30 border border-white/5 rounded-2xl p-4 flex gap-4">
                        <div className="shrink-0">
                          {review.user?.avatar ? (
                            <img src={review.user.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-white/10" />
                          ) : (
                            <FaUserCircle className="text-4xl text-gray-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-200">{review.user?.firstName} {review.user?.lastName}</p>
                          <div className="flex mb-2">
                            {[...Array(5)].map((_, i) => (
                              <span key={i}>
                                {i < review.rating ? <FaStar className="text-yellow-500 text-xs" /> : <FaRegStar className="text-gray-600 text-xs" />}
                              </span>
                            ))}
                          </div>
                          <p className="text-sm text-gray-400">{review.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sticky bottom action bar in Modal */}
              <div className="p-4 bg-gray-900 border-t border-white/10 flex gap-4 shrink-0">
                 {purchasedCourses.includes(selectedCourse._id.toString()) ? (
                   <Link to="/purchases" className="w-full text-center bg-green-600 text-white py-3 rounded-xl hover:bg-green-500 transition font-bold shadow-lg">Go to Course Dashboard</Link>
                 ) : (
                   <Link to={`/buy/${selectedCourse._id}`} className="w-full flex items-center justify-center gap-2 text-center bg-orange-600 text-white py-3 rounded-xl hover:bg-orange-500 transition font-bold shadow-lg hover:shadow-orange-500/30">
                     <span>Enroll Now</span> <span>₹{selectedCourse.price}</span>
                   </Link>
                 )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Courses;
