import express from "express"
import refrigerationController from "./refrigerationController";

let router = express.Router();

router.get("/", refrigerationController.findAll);
router.get("/:id", refrigerationController.find);
router.post("/save", refrigerationController.insert);
router.patch("/update/:id", refrigerationController.update);
router.patch("/delete/:id", refrigerationController.delete);

export default router;