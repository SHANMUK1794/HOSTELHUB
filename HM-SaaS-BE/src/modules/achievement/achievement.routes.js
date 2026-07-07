import express from "express";
import {
  addAchievement,
  deleteAchievement,
  updateAchievement,
  getAchievements,
  getDeletedAchievements,
  recoverAchievement,
  permanentDeleteAchievement,
  permanentDeleteAllAchievements,
  uploadImageController
} from "./achievement.controller.js";

import { adminWarden } from "../../utils/role.js";
import protect from "../../utils/authMiddleware.js";

import uploadLocal from "../../utils/uploadLocal.js"; // 🚨 Use Local Storage
const achievementRoutes = express.Router();

achievementRoutes.post("/add", protect, adminWarden, addAchievement);
achievementRoutes.delete("/delete/:id", protect, adminWarden, deleteAchievement);
achievementRoutes.put("/update/:id", protect, adminWarden, updateAchievement);
achievementRoutes.post("/upload-image", protect, adminWarden, uploadLocal.single("photo"), uploadImageController);
achievementRoutes.get("/all", protect, adminWarden, getAchievements);

achievementRoutes.delete("/permanentDeleteUser/:id", protect, adminWarden, permanentDeleteAchievement);
achievementRoutes.delete("/permanentDeleteAllUsers", protect, adminWarden, permanentDeleteAllAchievements);
achievementRoutes.get("/getDeletedAchievements", protect, adminWarden, getDeletedAchievements);
achievementRoutes.get("/recoverAchievement/:id", protect, adminWarden, recoverAchievement);

export default achievementRoutes;
