import express from "express";
import protect from "../../utils/authMiddleware.js"; 
import { allaccess } from "../../utils/role.js";

// 1. Import everything from your new single controller
import { 
    addComplaint, 
    getAllComplaints, 
    updateComplaint, 
    deleteComplaint,
    permanentDeleteComplaint,
    permanentDeleteAllComplaints,
    recoverComplaint,
    getDeletedComplaints
} from "./complaint.controller.js";

const router = express.Router();

// All routes require authentication middleware
router.use(protect);

router.post("/add", allaccess, addComplaint);
router.get("/", allaccess, getAllComplaints);
router.put("/update/:id", allaccess, updateComplaint);
router.delete("/:id", allaccess, deleteComplaint);

// Note: I removed the redundant 'protect' here since router.use(protect) covers it
router.delete("/permanentDeleteComplaint/:id", allaccess, permanentDeleteComplaint);
router.delete("/permanentDeleteAllComplaints", allaccess, permanentDeleteAllComplaints);
router.get("/getDeletedComplaints", allaccess, getDeletedComplaints);
router.get("/recoverComplaint/:id", allaccess, recoverComplaint);

// 2. Export as default to perfectly match your app.js import
export default router;