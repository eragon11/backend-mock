import express from "express";
import deviceZoneMapController from "./deviceZoneMapController";

const router = express.Router();

router.get("/", deviceZoneMapController.findAll);
router.get("/:id", deviceZoneMapController.find);
router.post("/save", deviceZoneMapController.insert);
router.patch("/update/:id", deviceZoneMapController.update);
router.patch("/delete/:id", deviceZoneMapController.delete);

export default router;