import express from "express"
import chillerController from '../chiller/chillerController';

let router = express.Router();

router.get('/', chillerController.chiller);

router.post('/chillergraph', chillerController.chillerGraph)

export default router;