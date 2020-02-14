import express from "express"
import tempratureController from "./tempratureController";

let router = express.Router();

router.get("/", tempratureController.findAll);
router.get("/:id", tempratureController.find);
router.post("/save", tempratureController.insert);
router.patch("/update/:id", tempratureController.update);
router.patch("/delete/:id", tempratureController.delete);

export default router;