import express from "express";
import energyMeterUnitController from "./energyMeterUnitController";

const router = express.Router();

router.get("/", energyMeterUnitController.findAll);
router.get("/:id", energyMeterUnitController.find);
router.post("/save", energyMeterUnitController.insert);
router.patch("/update/:id", energyMeterUnitController.update);
router.patch("/delete/:id", energyMeterUnitController.delete);

export default router;