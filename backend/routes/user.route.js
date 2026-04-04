import express from "express";
import { signup,login,logout,purchases,updateUserProfile,
  deleteAccount,forgotPassWord,verifyOtp,resetPassword} from "../controllers/user.controller.js";
import  userMiddleware from "../middleware/user.mid.js"

const router = express.Router();
import  upload  from "../middleware/multer.js";

// -> Routing matrix for user identity and profile lifecycle management
router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)

// -> Secure endpoints requiring active authorization schemas
router.get("/purchases",userMiddleware,purchases)
router.delete("/delete", userMiddleware, deleteAccount);
router.put("/user-update", userMiddleware, upload.single("avatar"), updateUserProfile);

// -> Multi-stage password recovery mechanism vectors
router.post("/forgot-password", forgotPassWord);
router.post("/verify-otp", verifyOtp); 
router.post("/verify-otp-and-reset", resetPassword);

export default router;

