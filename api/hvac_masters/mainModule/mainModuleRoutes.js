import express from "express"
import mainController from "./mainModuleController";

let router = express.Router();

router.get("/", mainController.findAll);
router.get("/:id", mainController.find);
router.post("/save", mainController.insert);
router.patch("/update/:id", mainController.update);
router.patch("/delete/:id", mainController.delete);

export default router;