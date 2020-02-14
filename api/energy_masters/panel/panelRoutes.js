import express from "express"
import panelController from "./panelController";

let router = express.Router();

router.get("/", panelController.findAll);
router.get("/:id", panelController.find);
router.post("/save", panelController.insert);
router.patch("/update/:id", panelController.update);
router.patch("/delete/:id", panelController.delete);

export default router;