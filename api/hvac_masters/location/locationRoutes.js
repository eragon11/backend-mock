import express from "express";
import locationController from "./locationController";

const router = express.Router();

/** GET */
router.get("/",  locationController.findAll);
router.get("/:id", locationController.find);
router.post("/save", locationController.insert);
router.patch("/update/:id", locationController.update);
router.patch("/delete/:id", locationController.delete);


export default router;