import express from "express";
import protect from "../../utils/authMiddleware.js";
import { adminStoreman } from "../../utils/role.js";
import * as controller from "./inventory.controller.js";

const router = express.Router();
router.use(protect);

router.post("/add", adminStoreman, controller.addItem);
router.get("/get_item_history", adminStoreman, controller.getAllItems);
router.put("/update/:id", adminStoreman, controller.updateItem);
router.delete("/:id", adminStoreman, controller.deleteItem);

router.get("/", controller.getItemsHistory);
router.delete("/inventory/:id", controller.deleteitemHard);
router.get("/export", controller.exportExcel);

export default router;