import express from "express"
import entitlementDetailsController from "./entitlementDetailsController";

let router = express.Router();

router.get("/", entitlementDetailsController.findAll);
router.get("/:id", entitlementDetailsController.find);
router.post("/save", entitlementDetailsController.insert);
router.patch("/update/:id", entitlementDetailsController.update);
// router.patch("/delete/:id", entitlementDetailsController.delete);

export default router;