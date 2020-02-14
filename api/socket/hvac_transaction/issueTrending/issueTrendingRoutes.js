import express from "express"
import issueTrendingController from '../issueTrending/issueTrendingController';

let router = express.Router();

router.post('/', issueTrendingController.issueTrending);

export default router;