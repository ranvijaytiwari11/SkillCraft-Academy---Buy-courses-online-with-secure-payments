import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../../frontend-config/api";
import { motion } from "framer-motion";
import { FaStar, FaRegStar, FaPlayCircle, FaCheckCircle, FaLaptopCode, FaArrowLeft } from "react-icons/fa";

function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hasPurchased, setHasPurchased] = useState(false);

  const token = JSON.parse(localStorage.getItem("user"))?.token;
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchCourse = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/course/${courseId}`);
      const courseData = res.data.course;
      setCourse(courseData);

      const existingReview = courseData.reviews.find(
        (review) => review.user._id === user?.user?._id
      );

      if (existingReview) {
        setRating(existingReview.rating);
        setComment(existingReview.comment);
      }
    } catch (err) {
      toast.error("Failed to load course");
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  useEffect(() => {
    const checkPurchase = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${BACKEND_URL}/purchase/check/${courseId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setHasPurchased(res.data.purchased);
      } catch (err) {
        console.error("Purchase check failed", err);
      }
    };

    checkPurchase();
  }, [courseId, token]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${BACKEND_URL}/course/${courseId}/review`,
        { rating, comment },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      toast.success("Review submitted!");
      navigate("/Courses"); 
    } catch (err) {
      toast.error(err.response?.data?.errors || "Failed to submit review");
    }
  };

  return (
    <div className="min-h-screen relative font-inter bg-[#050510] text-gray-100 overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[130px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-orange-600/10 blur-[130px]" />
      </div>

      <div className="container mx-auto px-4 py-10 pt-20 max-w-6xl relative z-10">
        <button 
          onClick={() => navigate(-1)} 
          className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white bg-white/5 border border-white/10 px-4 py-2 rounded-full transition w-max"
        >
          <FaArrowLeft /> Back to Courses
        </button>

        {course ? (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="glass-panel rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3">
              
              {/* Left Column: Image and Details */}
              <div className="lg:col-span-2">
                <div className="h-64 sm:h-80 relative">
                  <img
                    src={course.image?.url || "https://via.placeholder.com/800x400"}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent flex items-end p-8">
                    <div>
                      <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block uppercase tracking-wider">Premium Course</span>
                      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 leading-tight">{course.title}</h1>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-4">Course Overview</h2>
                  <p className="text-gray-400 mb-8 leading-relaxed text-lg">
                    {course.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    <div className="bg-black/30 border border-white/5 p-4 rounded-xl flex items-start gap-4">
                      <FaLaptopCode className="text-orange-400 text-2xl shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold text-white mb-1">100% Online</h4>
                        <p className="text-sm text-gray-500">Learn at your own pace from anywhere.</p>
                      </div>
                    </div>
                    <div className="bg-black/30 border border-white/5 p-4 rounded-xl flex items-start gap-4">
                      <FaCheckCircle className="text-green-400 text-2xl shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold text-white mb-1">Beginner Friendly</h4>
                        <p className="text-sm text-gray-500">No prior experience required.</p>
                      </div>
                    </div>
                  </div>

                  {/* Review Section */}
                  <div className="mt-12 bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                      <FaStar className="text-yellow-500" /> Share Your Experience
                    </h2>

                    {user ? (
                      hasPurchased ? (
                        <form onSubmit={handleSubmitReview} className="space-y-5">
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Your Rating</label>
                            <div className="flex gap-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setRating(star)}
                                  className="text-2xl focus:outline-none transition-transform hover:scale-110"
                                >
                                  {star <= rating ? (
                                    <FaStar className="text-yellow-500 drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]" />
                                  ) : (
                                    <FaRegStar className="text-gray-600" />
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Your Feedback</label>
                            <textarea
                              placeholder="What did you think of this course?"
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 placeholder-gray-600"
                              rows={4}
                              required
                            ></textarea>
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-8 rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.4)] transition inline-block"
                          >
                            {course.reviews?.some((r) => r.user._id === user?.user?._id)
                              ? "Update Review"
                              : "Submit Review"}
                          </motion.button>
                        </form>
                      ) : (
                        <div className="bg-orange-500/10 border border-orange-500/30 text-orange-200 p-4 rounded-xl flex items-center gap-3">
                          <span className="text-2xl">🔒</span>
                          <p>You need to enroll in this course to leave a review.</p>
                        </div>
                      )
                    ) : (
                      <div className="bg-blue-500/10 border border-blue-500/30 text-blue-200 p-4 rounded-xl flex items-center gap-3">
                        <span className="text-2xl">👤</span>
                        <p>
                          Please <Link to="/login" className="text-blue-400 font-bold underline underline-offset-2">log in</Link> to review this course.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Checkout Card */}
              <div className="bg-black/40 border-l border-white/10 p-8 flex flex-col justify-center lg:justify-start lg:sticky lg:top-0 lg:h-full">
                <div className="glass-panel p-6 rounded-2xl mb-6 text-center border-t border-white/20">
                  <p className="text-gray-400 text-sm mb-2 uppercase tracking-wide font-medium">Limited Time Offer</p>
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                      ₹{course.price}
                    </span>
                    <span className="text-xl text-gray-500 line-through">₹5999</span>
                  </div>
                  <div className="inline-block bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-sm font-semibold mb-6">
                    95% OFF
                  </div>

                  {hasPurchased ? (
                     <Link
                       to="/purchases"
                       className="block w-full bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-500 transition shadow-lg shrink-0 flex items-center justify-center gap-2"
                     >
                       <FaPlayCircle className="text-xl"/> Go to Course
                     </Link>
                  ) : (
                    <Link
                      to={`/buy/${course._id}`}
                      className="block w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 rounded-xl hover:shadow-[0_0_25px_rgba(249,115,22,0.6)] transition shadow-lg text-lg flex items-center justify-center gap-2"
                    >
                      <FaCheckCircle /> Enroll Now
                    </Link>
                  )}
                  
                  <p className="text-gray-500 text-xs mt-4">30-Day Money-Back Guarantee</p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-white">This course includes:</h3>
                  <ul className="space-y-3 text-gray-400 text-sm">
                    <li className="flex items-center gap-2"><span>▶</span> 24 hours on-demand video</li>
                    <li className="flex items-center gap-2"><span>📂</span> 15 downloadable resources</li>
                    <li className="flex items-center gap-2"><span>📱</span> Access on mobile and TV</li>
                    <li className="flex items-center gap-2"><span>🏆</span> Certificate of completion</li>
                  </ul>
                </div>
              </div>

            </div>
          </motion.div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseDetail;
