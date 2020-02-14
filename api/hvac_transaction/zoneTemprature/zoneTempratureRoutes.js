import express from "express"
import zoneTempratureController from "./zoneTempratureController";

let router = express.Router();

router.get("/", zoneTempratureController.findAll);
router.get("/:id", zoneTempratureController.find);
router.post("/save", zoneTempratureController.insert);
router.patch("/update/:id", zoneTempratureController.update);
router.patch("/delete/:id", zoneTempratureController.delete);

export default router;