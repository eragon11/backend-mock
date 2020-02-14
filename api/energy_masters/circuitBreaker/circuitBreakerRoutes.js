import express from "express"
import circuitBreakerController from "./circuitBreakerController";

let router = express.Router();

router.get("/", circuitBreakerController.findAll);
router.get("/:id", circuitBreakerController.find);
router.post("/save", circuitBreakerController.insert);
router.patch("/update/:id", circuitBreakerController.update);
router.patch("/delete/:id", circuitBreakerController.delete);

export default router;