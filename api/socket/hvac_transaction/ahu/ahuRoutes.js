import express from "express"
import ahuController from '../ahu/ahuController';
let router = express.Router();

router.get('/:locationId/:siteId/:buildingId', ahuController.ahu);

router.post('/ahugraph', ahuController.ahuGraph)

export default router;