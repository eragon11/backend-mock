import express from "express"
import validateController from './validateController';
let router = express.Router();

router.get('/:type/:name', validateController.validate);

export default router;