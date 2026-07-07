import express from "express";
import * as deleteController from "./delete.controller.js";
import protect from "../../utils/authMiddleware.js";

const router = express.Router();

router.get("/recent", protect, deleteController.getRecentDeleted);
router.get("/recover", protect, deleteController.recoverDeleted);
router.delete("/delete", protect, deleteController.permanentDelete);
router.delete(
  "/delete-all-universal",
  protect,
  deleteController.deleteAllTrashUniversal,
);
router.delete("/delete-all", protect, deleteController.deleteAllTrashByModule);

export default router;
