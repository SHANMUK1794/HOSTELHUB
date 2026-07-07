// routes/bulkImportRoute.js
import express from "express";
import multer from "multer";


import * as RegistrationController from "../modules/register/register.controller.js";
import * as RoomResidenceController from "../modules/roomAndResidents/Room&Residence.controller.js";
import RoomRentController from "../modules/FinanceAndUtilities/RoomRent/roomRent.controller.js";


const router = express.Router();

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });


// Route: Bulk Residents
router.post(
  "/import",
  upload.single("file"),
  RegistrationController.bulkImport,
);

// Route: Bulk Rooms
router.post(
  "/rooms",
  upload.single("file"),
  RoomResidenceController.bulkImportRooms,
);


router.post("/roomrent", upload.single("file"), RoomRentController.bulkImport);

export default router;
