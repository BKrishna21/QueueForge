import express from "express";
import { getallqueues,pausequeue,resumequeue,updatequeueconfiguration,getqueuedashboard,getqueuedetails,getqueuejobs } from "../controllers/queuecontroller.js";

const router=express.Router();

router.get("/",getallqueues);

router.patch("/:name/pause", pausequeue );

router.patch("/:name/resume", resumequeue );

router.patch("/:name/config", updatequeueconfiguration );

//queue dashboard routes

router.get("/dashboard", getqueuedashboard);

router.get("/dashboard/:name", getqueuedetails);

router.get("/dashboard/:name/jobs", getqueuejobs);

export default router;

