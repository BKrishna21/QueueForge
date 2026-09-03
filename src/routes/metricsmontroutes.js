import express from 'express';

import { getmetrics } from '../controllers/meticsmontcontroller.js';

const router = express.Router();

router.get("/metrics" , getmetrics );

export default router;

