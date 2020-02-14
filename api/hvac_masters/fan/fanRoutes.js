import express from "express"
import fanController from "./fanController";

let router = express.Router();

router.get("/", fanController.findAll);
router.get("/:id", fanController.find);
router.post("/save", fanController.insert);
router.patch("/update/:id", fanController.update);
router.patch("/delete/:id", fanController.delete);

export default router;