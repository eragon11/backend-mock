import express from "express";
import ahuController from "./ahuController";

const router = express.Router();

router.get("/", ahuController.findAll);
router.get("/:id", ahuController.find);
router.post("/save", ahuController.insert);
router.patch("/update/:id", ahuController.update);
router.patch("/delete/:id", ahuController.delete);

export default router;