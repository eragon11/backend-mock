import express from "express"
import refrigerationController from '../refrigeration/refrigerationController';

let router = express.Router();

router.get('/', refrigerationController.refrigeration);

router.get('/lightIntensity', refrigerationController.lightIntensity);

router.get('/doorStatus', refrigerationController.doorStatus);

router.get('/waterDetection', refrigerationController.waterDetection);

router.post('/refrigerationgraph', refrigerationController.refrigerationGraph);

router.post('/lightIntensityGraph', refrigerationController.lightIntensityGraph);

router.post('/doorstatusgraph', refrigerationController.doorstatusGraph);

router.post('/waterDetectionGraph', refrigerationController.waterDetectionGraph);

router.get('/power', refrigerationController.refrigerationPower);


export default router;