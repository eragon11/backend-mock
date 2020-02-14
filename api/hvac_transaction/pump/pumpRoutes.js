import express from "express"
import pumpController from "./pumpController";

let router = express.Router();

router.get("/", pumpController.findAll);
router.get("/:id", pumpController.find);
router.post("/save", pumpController.insert);
router.patch("/update/:id", pumpController.update);
router.patch("/delete/:id", pumpController.delete);

export default router;