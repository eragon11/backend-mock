import solenoidValveController from "./solenoidValveController";

import express from "express";

let router = express.Router();

router.get("/", solenoidValveController.findAll);
router.get("/:id", solenoidValveController.find);
router.post("/save", solenoidValveController.insert);
router.patch("/update/:id", solenoidValveController.update);
router.patch("/delete/:id", solenoidValveController.delete);

export default router;