import express from "express";
import sensorController from "./sensorController";

const router = express.Router();

router.get("/", sensorController.findAll);
router.get("/:id", sensorController.find);
router.post("/save", sensorController.insert);
router.patch("/update/:id", sensorController.update);
router.patch("/:id", sensorController.delete);

export default router;