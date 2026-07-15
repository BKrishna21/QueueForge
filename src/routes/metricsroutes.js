import express from "express";
import { getworkers,getindvworker,getqueuemetrics,getfailedjobs } from "../controllers/metricscontrollers.js";

const router=express.Router();

router.get("/workers", getworkers);

router.get("/worker/:name", getindvworker);

router.get("/queuemetrics", getqueuemetrics);

router.get("/failedjobs", getfailedjobs);

export default router;