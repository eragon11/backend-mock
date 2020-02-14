import express from "express";
import roleController from "./roleController";

const router = express.Router();

router.get("/", roleController.findAll);
router.get("/:id", roleController.find);
router.post("/save", roleController.insert);
router.patch("/update/:id", roleController.update);
router.patch("/delete/:id", roleController.delete);

export default router;