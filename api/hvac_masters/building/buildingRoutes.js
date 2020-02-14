import express from "express"
import buildingController from "./buildingController";

let router = express.Router();

router.get("/", buildingController.findAll);
router.get("/:id", buildingController.find);
router.post("/save", buildingController.insert);
router.patch("/update/:id", buildingController.update);
router.patch("/delete/:id", buildingController.delete);

export default router;