import express from "express"
import hvacUtilityController from "./hvacUtilityController";

let router = express.Router();

//find By Id Api's
router.get("/subModule/:id", hvacUtilityController.subModulefind);
router.get("/ahu/:id", hvacUtilityController.ahufind);
router.get("/chiller/:id", hvacUtilityController.chillerfind);
router.get("/compressor/:id", hvacUtilityController.compressorfind);
router.get("/fan/:id", hvacUtilityController.fanfind);
router.get("/zoneTemprature/:id", hvacUtilityController.zoneTempraturefind);
router.get("/pump/:id", hvacUtilityController.pumpfind);
router.get("/solenoidValve/:id", hvacUtilityController.solenoidValvefind);
router.get("/waterTank/:id", hvacUtilityController.waterTankfind);
router.get("/site/:id", hvacUtilityController.sitefind);
router.get("/building/:id", hvacUtilityController.buildingfind);
router.get("/zone/:id", hvacUtilityController.zonefind);
router.get("/hvacPanel/:id", hvacUtilityController.hvacPanelfind);
router.get("/panelById/:id", hvacUtilityController.panelfind)

//find All Api's
router.get("/subModule", hvacUtilityController.subModuleFindAll);
router.get("/ahu/:locationId/:siteId/:buildingId", hvacUtilityController.ahufindAll);
router.get("/chiller/:locationId/:siteId/:buildingId", hvacUtilityController.chillerfindAll);
router.get("/compressor/:locationId/:siteId/:buildingId", hvacUtilityController.compressorfindAll);
router.get("/fan/:locationId/:siteId/:buildingId", hvacUtilityController.fanfindAll);
router.get("/zoneTemperature/:locationId/:siteId/:buildingId", hvacUtilityController.zoneTemperaturefindAll);
router.get("/pump/:locationId/:siteId/:buildingId", hvacUtilityController.pumpfindAll);
router.get("/waterTank/:locationId/:siteId/:buildingId", hvacUtilityController.waterTankfindAll);
router.get("/solenoidValve/:locationId/:siteId/:buildingId", hvacUtilityController.solenoidValvefindAll);
router.get("/site", hvacUtilityController.sitefindAll);
router.get("/building", hvacUtilityController.buildingfindAll);
router.get("/zone", hvacUtilityController.zonefindAll);
router.get("/refrigerationTemperature", hvacUtilityController.refrigerationfindAll);
router.get("/refrigerationWaterDetection", hvacUtilityController.waterDetectionfindAll);
router.get("/refrigerationDoorStatus", hvacUtilityController.doorStatusfindAll);
router.get("/panel/:type", hvacUtilityController.panelfindAll);

router.get("/sitemulti", hvacUtilityController.sitefindMulti);
router.get("/getsubmodule", hvacUtilityController.getSubModuleByRole);

export default router;