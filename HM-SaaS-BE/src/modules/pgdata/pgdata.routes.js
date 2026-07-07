import express from "express";
import * as controller from "./pgdata.controller.js";
import protect from "../../utils/authMiddleware.js";
import { adminWarden } from "../../utils/role.js";

const router = express.Router();

router.post(
  "/register",
  protect,
  adminWarden,
  controller.register
);

router.get(
  "/getalluser",
  protect,
  adminWarden,
  controller.getAllUsers
);

router.put(
  "/update/:id",
  protect,
  adminWarden,
  controller.update
);

router.put(
  "/deactive/:id",
  protect,
  adminWarden,
  controller.deactivateUser
);

router.get(
  "/mobile",
  protect,
  adminWarden,
  controller.getUserByMobile
);

router.delete(
  "/delete/:id",
  protect,
  adminWarden,
  controller.deleteUser
);

router.get(
  "/export",
  protect,
 adminWarden,
  controller.exportExcel
);

export default router;