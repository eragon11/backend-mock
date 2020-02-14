import express from "express"
import sensorHealthController from "./sensorHealthController";

let router = express.Router();

router.get('/hvac/ahu', sensorHealthController.sensorHealthAhu);
router.get('/hvac/compressor', sensorHealthController.sensorHealthCompressor);
router.get('/hvac/fan', sensorHealthController.sensorHealthFan);
router.get('/hvac/zoneTemperature', sensorHealthController.sensorHealthZoneTemperature);
router.get('/hvac/pump', sensorHealthController.sensorHealthPump);
router.get('/hvac/chiller', sensorHealthController.sensorHealthChiller);
router.get('/hvac/solenoidValve', sensorHealthController.sensorHealthSolenoidValve);
router.get('/hvac/waterTank', sensorHealthController.sensorHealthWaterTank);

router.get('/:type', sensorHealthController.sensorHealthBasedOnType);

export default router;