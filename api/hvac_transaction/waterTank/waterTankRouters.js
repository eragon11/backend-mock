import express from "express"
import waterTankController from "./waterTankController";

let router = express.Router();

router.get("/", waterTankController.findAll);
router.get("/:id", waterTankController.find);
router.post("/save", waterTankController.insert);
router.patch("/update/:id", waterTankController.update);
router.patch("/delete/:id", waterTankController.delete);

export default router;