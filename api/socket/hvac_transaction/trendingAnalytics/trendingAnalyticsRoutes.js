import express from "express"
import trendingAnalyticsController from '../trendingAnalytics/trendingAnalyticsController';

let router = express.Router();

router.get('/energyMeter/:locationId/:siteId/:buildingId', trendingAnalyticsController.trendingAnalytics);

router.get('/energyMeter/zoneTemperature/:locationId/:siteId/:buildingId', trendingAnalyticsController.zoneTemperature);

router.get('/energyMeter/zoneHumidity/:locationId/:siteId/:buildingId', trendingAnalyticsController.zoneHumidity);

router.get('/energyMeter/zoneDevices/:locationId/:siteId/:buildingId', trendingAnalyticsController.zoneDevices);

router.get('/energyMeter/activeDevices', trendingAnalyticsController.activeDevices);

router.get('/energyMeter/totalDevices', trendingAnalyticsController.totalDevices);

// router.post('/ahugraph', ahuController.trendingAnalyticsGraph)

export default router;