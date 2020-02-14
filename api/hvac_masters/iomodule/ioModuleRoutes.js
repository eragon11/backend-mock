import express from "express";
import ioModuleController from "./ioModuleController";

const router = express.Router();

router.get("/", ioModuleController.findAll);
router.get("/:id", ioModuleController.find);
router.post("/save", ioModuleController.insert);
router.patch("/update/:id", ioModuleController.update);
router.patch("/delete/:id", ioModuleController.delete);

export default router;