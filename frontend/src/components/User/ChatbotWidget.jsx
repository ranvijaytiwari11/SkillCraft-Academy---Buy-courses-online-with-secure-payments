import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCommentDots, FaTimes, FaRobot, FaUser, FaPaperPlane } from "react-icons/fa";

const PREDEFINED_QAS = [
  {
    question: "What is SkillCraft?",
    answer: "SkillCraft is a premium e-learning platform offering top-tier courses to help you upskill and grow your career!",
  },
  {
    question: "How do I enroll?",
    answer: "You can browse courses from the 'Courses' page. Click 'Enroll Now' and proceed to purchase securely via Stripe or Razorpay.",
  },
  {
    question: "Do I get a certificate?",
    answer: "Yes! Upon fully completing all modules of a course, you'll instantly receive a verifiable certificate.",
  },
  {
    question: "Can I get a refund?",
    answer: "Absolutely. We offer a 30-day money-back guarantee if you are unsatisfied with any course.",
  },
];

function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi there! 👋 Welcome to SkillCraft. How can I help you today?" }
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleAskQuestion = (qa) => {
    // Add user question
    setMessages((prev) => [...prev, { sender: "user", text: qa.question }]);
    
    // Simulate robot typing delay
    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: "bot", text: qa.answer }]);
    }, 600);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[100] bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.5)] border border-orange-400"
      >
        {isOpen ? <FaTimes className="text-2xl" /> : <FaCommentDots className="text-2xl" />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 z-[100] w-80 sm:w-96 glass-panel bg-[#0a0a14]/90 border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 text-white flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <FaRobot className="text-xl" />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-none">SkillCraft Assistant</h3>
                <span className="text-xs text-orange-100 flex items-center gap-1 mt-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse"></span> Online
                </span>
              </div>
            </div>

            {/* Chat Body */}
            <div className="h-80 overflow-y-auto p-4 space-y-4 hide-scroll bg-gradient-to-b from-transparent to-black/30">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: msg.sender === "user" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} items-start gap-2`}
                >
                  {msg.sender === "bot" && (
                    <div className="bg-orange-500/20 border border-orange-500/50 p-2 rounded-full shrink-0">
                       <FaRobot className="text-orange-400 text-sm" />
                    </div>
                  )}
                  
                  <div 
                    className={`px-4 py-2 text-sm rounded-2xl max-w-[75%] shadow-md ${
                      msg.sender === "user" 
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-tr-none" 
                        : "bg-white/10 text-gray-200 border border-white/5 rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>

                  {msg.sender === "user" && (
                     <div className="bg-blue-500/20 border border-blue-500/50 p-2 rounded-full shrink-0">
                       <FaUser className="text-blue-400 text-sm" />
                     </div>
                  )}
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div className="p-3 border-t border-white/10 bg-black/40">
              <p className="text-xs text-gray-400 mb-2 font-semibold">Suggested Questions:</p>
              <div className="flex flex-wrap gap-2">
                {PREDEFINED_QAS.map((qa, i) => (
                  <button
                    key={i}
                    onClick={() => handleAskQuestion(qa)}
                    className="bg-white/5 hover:bg-orange-500/20 border border-white/10 hover:border-orange-500/40 text-gray-300 text-xs px-3 py-1.5 rounded-full transition-all text-left"
                  >
                    {qa.question}
                  </button>
                ))}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ChatbotWidget;
