import express from "express"
import doorStatusController from "./doorStatusController";

let router = express.Router();

router.get("/", doorStatusController.findAll);
router.get("/:id", doorStatusController.find);
router.post("/save", doorStatusController.insert);
router.patch("/update/:id", doorStatusController.update);
router.patch("/delete/:id", doorStatusController.delete);

export default router;