import express from "express";
import zoneController from "./zoneController";

let router = express.Router();

router.get("/", zoneController.findAll);
router.get("/:id", zoneController.find);
router.post("/save", zoneController.insert);
router.patch("/update/:id", zoneController.update);
router.patch("/delete/:id", zoneController.delete);

export default router;