import express from "express"
import nodeserver from "./nodeServerController";

let router = express.Router();

router.get("/rpm", nodeserver.rpm);
router.get("/waterFlow", nodeserver.waterFlow);
router.get("/waterTank", nodeserver.waterTank);
router.get("/relay", nodeserver.relay);

export default router;