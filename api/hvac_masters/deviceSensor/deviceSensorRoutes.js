import express from "express";
import deviceSensorController from "./deviceSensorController";

const router = express.Router();

router.get("/", deviceSensorController.findAll);
router.get("/:id", deviceSensorController.find);
router.post("/save", deviceSensorController.insert);
router.patch("/update/:id", deviceSensorController.update);
router.patch("/delete/:id", deviceSensorController.delete);

export default router;