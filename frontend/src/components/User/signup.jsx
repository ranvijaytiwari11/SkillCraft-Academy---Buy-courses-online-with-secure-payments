import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../../assets/logo.png";
import { BACKEND_URL } from '../../frontend-config/api';
import { motion } from 'framer-motion';

function Signup() {
  const [firstName, setFirstName]     = useState("");
  const [lastName, setLastName]       = useState("");
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    localStorage.removeItem("resetEmail");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BACKEND_URL}/user/signup`, {
        firstName,
        lastName,
        email,
        password
      }, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      const errMsg = error.response?.data?.errors || "User already exists or invalid data";
      setErrorMessage(errMsg);
    }
  };

  return (
    <div className="min-h-screen text-white font-inter relative overflow-hidden flex items-center justify-center py-10">
      
      {/* Background Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-orange-600/30 blur-[130px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/30 blur-[130px]" />
      </div>

      {/* Header */}
        <header className="absolute top-4 left-0 right-0 w-[95%] max-w-7xl mx-auto glass-header rounded-full p-4 flex justify-between items-center z-50">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="bg-white/10 p-1 rounded-full border border-white/20 group-hover:border-orange-500/50 transition">
             <img src={logo} alt="Logo" className="w-8 h-8 rounded-full" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">SkillCraft</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link to="/login" className="text-white hover:text-orange-400 text-sm font-medium transition">Login</Link>
          <Link to="/courses" className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-1.5 rounded-full text-sm font-medium shadow-[0_0_15px_rgba(249,115,22,0.4)]">Join Now</Link>
        </div>
      </header>

      <Link
        to="/"
        className="absolute top-28 left-4 text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-sm font-medium transition-all z-40"
      >
        ⬅ Back
      </Link>

      {/* Form Container with animation */}
      <motion.div
        className="glass-panel p-8 sm:p-10 rounded-3xl w-full max-w-[480px] mx-4 relative z-10"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Create Account</h2>
          <p className="text-gray-400 text-sm">Join <span className="text-orange-400 font-semibold">SkillCraft</span> today!</p>
        </div>

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="text"
                id="firstname"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="peer w-full px-4 pt-5 pb-2 rounded-xl bg-black/40 border border-white/10 focus:border-orange-500 focus:outline-none transition text-white placeholder-transparent"
                placeholder="Firstname"
              />
              <label htmlFor="firstname" className="absolute left-4 top-1.5 text-xs text-gray-400 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3.5 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-orange-400 transition-all">
                First Name
              </label>
            </div>
            
            <div className="relative">
              <input
                type="text"
                id="lastname"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="peer w-full px-4 pt-5 pb-2 rounded-xl bg-black/40 border border-white/10 focus:border-orange-500 focus:outline-none transition text-white placeholder-transparent"
                placeholder="Lastname"
              />
               <label htmlFor="lastname" className="absolute left-4 top-1.5 text-xs text-gray-400 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3.5 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-orange-400 transition-all">
                Last Name
              </label>
            </div>
          </div>

          <div className="relative">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="peer w-full px-4 pt-5 pb-2 rounded-xl bg-black/40 border border-white/10 focus:border-orange-500 focus:outline-none transition text-white placeholder-transparent"
              placeholder="Email"
            />
            <label htmlFor="email" className="absolute left-4 top-1.5 text-xs text-gray-400 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3.5 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-orange-400 transition-all">
              Email Address
            </label>
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="peer w-full px-4 pt-5 pb-2 pr-12 rounded-xl bg-black/40 border border-white/10 focus:border-orange-500 focus:outline-none transition text-white placeholder-transparent"
              placeholder="Password"
            />
            <label htmlFor="password" className="absolute left-4 top-1.5 text-xs text-gray-400 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3.5 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-orange-400 transition-all">
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 text-gray-400 hover:text-orange-500 focus:outline-none"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {errorMessage && (
             <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/30 p-2 rounded-lg">
              {errorMessage}
            </motion.p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] text-white font-semibold py-3.5 rounded-xl transition-all mt-4"
          >
            Complete Signup
          </motion.button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-400 hover:text-orange-300 font-semibold transition">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Signup;
