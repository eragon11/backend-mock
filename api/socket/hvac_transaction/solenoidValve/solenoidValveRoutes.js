import express from "express"
import solenoidValveController from '../solenoidValve/solenoidValveController';

let router = express.Router();

router.get('/:locationId/:siteId/:buildingId', solenoidValveController.solenoidValve);

router.post('/solenoidValveGraph', solenoidValveController.solenoidValveGraph)

export default router;