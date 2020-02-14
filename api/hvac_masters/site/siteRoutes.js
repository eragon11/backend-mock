import express from "express";
import siteController from "./siteController"

const router = express.Router();

router.get("/", siteController.findAll);
router.get("/:id", siteController.find);
router.post("/save", siteController.insert);
router.patch("/update/:id", siteController.update);
router.patch("/delete/:id", siteController.delete);

export default router;