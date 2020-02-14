import express from "express";
import userController from "./userController";
import upload from "../../../middelwares/fileUploader";

const router = express.Router();
// upload.single("profilePicture"),

/** GET */
router.get("/auth", userController.auth);
router.get("/", userController.findAll);
router.get("/:id", userController.find);
router.post("/save", upload.single("profilePicture"), userController.create);
router.patch("/update/:id", userController.update);
router.patch("/delete/:id", userController.delete);
router.post("/login", userController.login);
router.post("/Register", userController.register);

export default router;