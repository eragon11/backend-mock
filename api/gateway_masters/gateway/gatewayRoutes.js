import express from "express"
import gatewayController from "./gatewayController";

let router = express.Router();

router.get("/", gatewayController.findAll);
router.get("/:id", gatewayController.find);
router.post("/save", gatewayController.insert);
router.patch("/update/:id", gatewayController.update);
router.patch("/delete/:id", gatewayController.delete);

export default router;