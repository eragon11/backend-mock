import express from "express"
import chillerController from "./chillerController";

let router = express.Router();

router.get("/", chillerController.findAll);
router.get("/:id", chillerController.find);
router.post("/save", chillerController.insert);
router.patch("/update/:id", chillerController.update);
router.patch("/delete/:id", chillerController.delete);

export default router;