import express from "express"
import cronController from "../cron/cronController";
import tokenAuth from "../../../middelwares/tokenAuth";

let router = express.Router();

router.get('/cron', cronController.testCron);

router.get('/based_on_building_id', tokenAuth.verifyPermission(["Admin", "Master"]), cronController.basedOnBuildingId);

router.get('/based_on_roles', cronController.basedOnRoles);
export default router;