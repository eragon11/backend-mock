import express from "express"
import entitlementHeaderController from "./entitlementHeaderController";

let router = express.Router();

router.get("/", entitlementHeaderController.findAll);
router.get("/:id", entitlementHeaderController.find);
router.post("/save", entitlementHeaderController.insert);
router.patch("/update/:id", entitlementHeaderController.update);
router.patch("/delete/:id", entitlementHeaderController.delete);

export default router;