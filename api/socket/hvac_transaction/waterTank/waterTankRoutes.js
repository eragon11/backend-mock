import express from "express"
import waterTankController from '../waterTank/waterTankController';

let router = express.Router();

router.get('/:locationId/:siteId/:buildingId', waterTankController.waterTank);

router.post('/waterTankGraph', waterTankController.waterTankGraph)

export default router;