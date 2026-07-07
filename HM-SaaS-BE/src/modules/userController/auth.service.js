import "dotenv/config"; 
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import * as usersRepo from "./auth.repository.js";
import generateToken from "../../utils/generateToken.js";
import { generateUserData } from "../../utils/generateUserData.js";
import { autoVacateCheck } from "../../utils/autovacate.js";
import { runDailyNotificationsOnce } from "../notification/notification.controller.js";

import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// 1. ADD THIS STATIC IMPORT
import userModel from "./auth.model.js"; 

// Helper: Setup Nodemailer transport
const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com", // Points to Hostinger instead of Gmail
  port: 465,
  secure: true, 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});;

const createCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: true,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
};

// ADD THIS FUNCTION AT THE BOTTOM OF THE FILE
export const googleAuthUser = async (googleToken, res) => {
  // 1. Verify the token with Google
  const ticket = await googleClient.verifyIdToken({
    idToken: googleToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  
  // 2. Extract user info from Google's payload
  const { email, name } = ticket.getPayload();

  // 3. Check if user exists in your database
  let user = await usersRepo.findUserByEmailRepo(email);

  if (!user) {
    // 4. If they don't exist, create an account for them automatically!
    // We generate a random password because Google handles their actual password
    const randomPassword = Math.random().toString(36).slice(-10);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(randomPassword, salt);

    user = await usersRepo.createUserRepo({
      username: name,
      email: email,
      password: hashedPassword,
      staffName: name, // Fallback to their Google Name
      branchName: "Common",
      role: "Admin",
    });
  }

  // 5. Generate your app's standard JWT tokens (Exactly like standard login)
  const userData = await generateUserData(user);
  generateToken(res, user._id, user.tenantId);

  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  user.refreshToken = refreshToken;
  await usersRepo.saveUserRepo(user);

  return {
    userData,
    refreshToken,
    cookieOptions: createCookieOptions(),
  };
};

export const loginUser = async (body, res) => {
  const { email, password } = body;

  if (!email || !password) {
    const err = new Error("email and password are required.");
    err.statusCode = 400;
    throw err;
  }

  const user = await usersRepo.findUserByEmailRepo(email);
  if (!user) {
    const err = new Error("Invalid email .");
    err.statusCode = 401;
    throw err;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error("Invalid email or password.");
    err.statusCode = 401;
    throw err;
  }

  const userData = await generateUserData(user);
  generateToken(res, user._id, user.tenantId);

  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" },
  );

  user.refreshToken = refreshToken;
  await usersRepo.saveUserRepo(user);

  // Run background utilities — don't let errors here break the login
  runDailyNotificationsOnce(user.tenantId).catch(e =>
    console.warn("[login] runDailyNotificationsOnce error:", e.message)
  );
  autoVacateCheck().catch(e =>
    console.warn("[login] autoVacateCheck error:", e.message)
  );

  return {
    userData,
    refreshToken,
    cookieOptions: createCookieOptions(),
  };
};

export const signupUser = async (body) => {
  const { username, email, password, staffName, branchName } = body || {};

  console.log(username, email, password);

  const normalizedEmail = email?.trim().toLowerCase();
  const normalizedUsername = username?.trim();

  console.log(normalizedUsername);
  console.log(normalizedEmail);

  if (!normalizedUsername || !normalizedEmail || !password) {
    const err = new Error("Username, email and password are required.");
    err.statusCode = 400;
    throw err;
  }

  // (debug line removed)

  const existingUser = await usersRepo.findUserByEmailRepo(normalizedEmail);
  if (existingUser) {
    const err = new Error("Email already exists.");
    err.statusCode = 400;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const savedUser = await usersRepo.createUserRepo({
    username: normalizedUsername,
    email: normalizedEmail,
    password: hashedPassword,
    staffName: staffName?.trim() || normalizedUsername,
    branchName: branchName?.trim() || "Common",
    role: "Admin",
    tenantId: null, // Tenant created separately after signup via /api/tenant/v1/create
  });

  return savedUser;
};

export const logoutUser = async () => {
  return true;
};

export const refreshAccessToken = async (incomingRefreshToken, res) => {
  if (!incomingRefreshToken) {
    const err = new Error("No refresh token provided");
    err.statusCode = 400;
    throw err;
  }

  let decoded;
  try {
    decoded = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );
  } catch (error) {
    const err = new Error("Invalid refresh token");
    err.statusCode = 401;
    throw err;
  }

  const user = await usersRepo.findUserByIdRepo(decoded.userId);
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  if (incomingRefreshToken !== user.refreshToken) {
    const err = new Error("Invalid refresh token");
    err.statusCode = 401;
    throw err;
  }

  generateToken(res, user._id, user.tenantId);

  const newRefreshToken = jwt.sign(
    { userId: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" },
  );

  user.refreshToken = newRefreshToken;
  await usersRepo.saveUserRepo(user);

  return {
    newRefreshToken,
    cookieOptions: createCookieOptions(),
  };
};

export const sendOtp = async (email) => {
  const user = await usersRepo.findUserByEmailRepo(email);
  if (!user) {
    const err = new Error("User not found with this email.");
    err.statusCode = 404;
    throw err;
  }

  // Generate OTP and save to DB
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpiry = Date.now() + 2 * 60 * 1000; 

  await usersRepo.saveUserRepo(user);

  // ACTUALLY SEND THE EMAIL
  try {
    const info = await transporter.sendMail({
      from: `"Hostel Management" <${process.env.EMAIL_USER}>`, // Formats the sender name nicely
      to: email,
      subject: "Your Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`,
    });
    
    console.log("✅ Email sent to Hostinger! Message ID:", info.messageId);
  } catch (emailError) {
    console.error("❌ Failed to send email:", emailError);
    const err = new Error("Could not deliver the email. Please try again later.");
    err.statusCode = 500;
    throw err;
  }

  return true;
};


export const verifyOtp = async (email, otp) => {
  const user = await usersRepo.findUserByEmailRepo(email);
  if (!user) {
    const err = new Error("User not found.");
    err.statusCode = 404;
    throw err;
  }

  if (user.otp !== otp || user.otpExpiry < Date.now()) {
    const err = new Error("Invalid or expired OTP.");
    err.statusCode = 400;
    throw err;
  }

  return true; 
};

export const resetPassword = async (email, newPassword) => {
  const user = await usersRepo.findUserByEmailRepo(email);
  if (!user) {
    const err = new Error("User not found.");
    err.statusCode = 404;
    throw err;
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  user.otp = null; 
  user.otpExpiry = null;

  await usersRepo.saveUserRepo(user);
  return true;
};