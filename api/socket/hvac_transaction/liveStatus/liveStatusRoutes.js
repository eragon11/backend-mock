import express from "express"
import liveStatusController from '../liveStatus/liveStatusController';

let router = express.Router();

router.get('/energyPower/:id', liveStatusController.energypower);

router.get('/compressor/:id', liveStatusController.compressor);

router.get('/zoneTemperature/:id', liveStatusController.zoneTemperature);

router.get('/fan/:id', liveStatusController.fan);

router.get('/pump/:id', liveStatusController.pump);

router.get('/solenoidValve/:id', liveStatusController.solenoidValve);

router.get('/waterTank/:id', liveStatusController.waterTank);

router.get('/chiller/:id', liveStatusController.chiller);

export default router;