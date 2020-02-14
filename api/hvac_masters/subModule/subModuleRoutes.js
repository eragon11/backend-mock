import express from "express"
import subController from "./subModuleController";

let router = express.Router();

router.get("/", subController.findAll);
router.get("/:id", subController.find);
router.post("/save", subController.insert);
router.patch("/update/:id", subController.update);
router.patch("/delete/:id", subController.delete);

export default router;