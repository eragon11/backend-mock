import express from "express";
import hvacPanelController from "./hvacPanelController";

const router = express.Router();

router.get("/", hvacPanelController.findAll);
router.get("/:id", hvacPanelController.find);
router.post("/save", hvacPanelController.insert);
router.patch("/update/:id", hvacPanelController.update);
router.patch("/delete/:id", hvacPanelController.delete);

export default router;