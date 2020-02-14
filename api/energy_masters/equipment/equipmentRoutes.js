import express from "express"
import equipmentController from "./equipmentController";

let router = express.Router();

router.get("/", equipmentController.findAll);
router.get("/:id", equipmentController.find);
router.post("/save", equipmentController.insert);
router.patch("/update/:id", equipmentController.update);
router.patch("/delete/:id", equipmentController.delete);

export default router;