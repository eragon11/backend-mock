import express from "express"
import lightIntensityController from "./lightIntensityController";

let router = express.Router();

router.get("/", lightIntensityController.findAll);
router.get("/:id", lightIntensityController.find);
router.post("/save", lightIntensityController.insert);
router.patch("/update/:id", lightIntensityController.update);
router.patch("/delete/:id", lightIntensityController.delete);

export default router;