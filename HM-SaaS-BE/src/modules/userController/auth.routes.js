import express from "express";
const router = express.Router();

import { login, logout, refreshAccessToken, signup, sendOtp, verifyOtp, resetPassword, googleLogin } from "./auth.controller.js";

router.post("/google-login", googleLogin);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refreshAccessToken", refreshAccessToken);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

export default router;