import express from "express"
import pumpController from '../pump/pumpController';

let router = express.Router();

router.get('/:locationId/:siteId/:buildingId', pumpController.pump);

router.post('/pumpgraph', pumpController.pumpGraph);

export default router;