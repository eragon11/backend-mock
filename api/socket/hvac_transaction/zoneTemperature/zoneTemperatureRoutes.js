import express from "express"
import zoneTemperatureController from '../zoneTemperature/zoneTemperatureController';

let router = express.Router();

router.get('/:locationId/:siteId/:buildingId', zoneTemperatureController.zone);

router.post('/zonegraph', zoneTemperatureController.zoneGraph)

export default router;