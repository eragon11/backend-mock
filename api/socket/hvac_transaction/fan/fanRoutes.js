import express from "express"
import fanController from '../fan/fanController';

let router = express.Router();

router.get('/:locationId/:siteId/:buildingId', fanController.fan);

router.post('/fangraph', fanController.fanGraph)

export default router;