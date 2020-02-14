import express from "express"
import compressorController from "./compressorController";

let router = express.Router();

router.get("/", compressorController.findAll);
router.get("/:id", compressorController.find);
router.post("/save", compressorController.insert);
router.patch("/update/:id", compressorController.update);
router.patch("/delete/:id", compressorController.delete);

export default router;