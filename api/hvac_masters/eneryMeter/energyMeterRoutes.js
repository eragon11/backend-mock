import express from "express";
import energyMeterController from "./energyMeterController";

const router = express.Router();

router.get("/", energyMeterController.findAll);
router.get("/:id", energyMeterController.find);
router.post("/save", energyMeterController.insert);
router.patch("/update/:id", energyMeterController.update);
router.delete("/delete/:id", energyMeterController.delete);

export default router;