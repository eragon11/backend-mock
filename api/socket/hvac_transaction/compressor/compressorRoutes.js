import express from "express"
import compressorController from '../compressor/compressorController';

let router = express.Router();

router.get('/:locationId/:siteId/:buildingId', compressorController.compressor);

router.post('/compressorgraph', compressorController.compressorGraph)

export default router;