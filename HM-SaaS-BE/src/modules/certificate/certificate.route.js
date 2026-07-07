import express from "express";
import * as controller from "./certificate.controller.js";
import { allaccess } from "../../utils/role.js";
import protect from "../../utils/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, allaccess, controller.addCertificate);

router.get("/", protect, allaccess, controller.getAllCertificates);

router.put("/update/:id", protect, allaccess, controller.updateCertificate);

router.delete("/delete/:id", protect, allaccess, controller.deleteCertificate);

router.post(
  "/recoverCertificate/:id",
  protect,
  allaccess,
  controller.recoverCertificate,
);

router.delete(
  "/permanentDeleteCertificate/:id",
  protect,
  allaccess,
  controller.permanentDeleteCertificate,
);

router.delete(
  "/permanentDeleteAllCertificates",
  protect,
  allaccess,
  controller.permanentDeleteAllCertificates,
);

router.get(
  "/getDeletedCertificates",
  protect,
  allaccess,
  controller.getDeletedCertificates,
);

export default router;
