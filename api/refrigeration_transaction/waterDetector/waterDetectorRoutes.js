import express from "express"
import waterDetectorTransactionController from "./waterDetectorController";

let router = express.Router();

router.get("/", waterDetectorTransactionController.findAll);
router.get("/:id", waterDetectorTransactionController.find);
router.post("/save", waterDetectorTransactionController.insert);
router.patch("/update/:id", waterDetectorTransactionController.update);
router.patch("/delete/:id", waterDetectorTransactionController.delete);

export default router;