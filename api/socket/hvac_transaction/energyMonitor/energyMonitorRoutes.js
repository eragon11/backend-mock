import express from "express"
import energyMonitorController from '../energyMonitor/energyMonitorController';
import tokenAuthorization from "../../../../middelwares/tokenAuth";

let router = express.Router();

router.get('/', energyMonitorController.energyMonitor);

router.post('/energyMonitorConsumption', energyMonitorController.energyMonitorConsumption);

router.post('/energyMonitor/Consumption/lastMonth', energyMonitorController.consumptionLastMonth);

router.post('/energyMonitorgraphMulti', energyMonitorController.energyMonitorGraphMulti);

router.post('/overall/energyMonitor/panel', energyMonitorController.energyMonitorPanel);

router.get('/analytics/:type/:locationId/:siteId/:buildingId', energyMonitorController.energyAnalytics);

router.post('/analytics/analyticsgraph', energyMonitorController.energyAnalyticsGraph);

router.post('/analytics/analyticsgraph/panel', energyMonitorController.panelGraph);

router.post('/analytics/powerConsumption/energyConsumption', energyMonitorController.energyConsumptionList);

router.get('/sensorHealth', energyMonitorController.sensorHealth);
export default router;