import express from "express"
import energyMeterController from "./energyMeterController";

let router = express.Router();

router.get("/", energyMeterController.findAll);
router.get("/:id", energyMeterController.find);
router.post("/save", energyMeterController.insert);
router.patch("/update/:id", energyMeterController.update);
router.patch("/delete/:id", energyMeterController.delete);

export default router;