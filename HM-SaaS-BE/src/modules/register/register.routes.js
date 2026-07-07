import express from "express";
import protect from "../../utils/authMiddleware.js";
import { adminWarden } from "../../utils/role.js";

import {
  register,
  getAllUsers,
  getUserByMobile,
  updateUser,
  deleteUser,
  deactive,
  permanentDeleteUser,
  permanentDeleteAllUsers,
  getDeletedUsers,
  recoverUser,
} from "./register.controller.js";

const router = express.Router();

/* ---------------- CREATE ---------------- */
router.post("/register", protect, adminWarden, register);

/* ---------------- READ (NEW + COMPATIBILITY) ---------------- */

// ✅ NEW correct route
router.get("/users", protect, adminWarden, getAllUsers);

// ✅ BACKWARD COMPATIBILITY (your frontend uses this)
router.get("/getalluser", protect, adminWarden, getAllUsers);
router.get("/mobile", protect, adminWarden, getUserByMobile);

/* ---------------- DELETED ---------------- */
router.get("/deleted-users", protect, adminWarden, getDeletedUsers);

/* ---------------- UPDATE ---------------- */
router.put("/update/:id", protect, adminWarden, updateUser);
router.put("/recover/:id", protect, adminWarden, recoverUser);
router.put("/deactive", protect, adminWarden, deactive);

/* ---------------- DELETE ---------------- */
router.delete("/delete/:id", protect, adminWarden, deleteUser);

/* ---------------- PERMANENT DELETE ---------------- */
router.delete("/permanent/:id", protect, adminWarden, permanentDeleteUser);
router.delete("/permanent-all", protect, adminWarden, permanentDeleteAllUsers);

export default router;