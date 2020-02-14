import express from "express";
import testController from "./testController";

let router = express.Router();

router.post("/", testController.save);

export default router;

