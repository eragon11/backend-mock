import express from "express"
import waterDetectorMasterController from "./waterDetectorController";

let router = express.Router();

router.get("/", waterDetectorMasterController.findAll);
router.get("/:id", waterDetectorMasterController.find);
router.post("/save", waterDetectorMasterController.insert);
router.patch("/update/:id", waterDetectorMasterController.update);
router.patch("/delete/:id", waterDetectorMasterController.delete);

export default router;