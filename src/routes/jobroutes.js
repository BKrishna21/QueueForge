import express from "express";
import { createjob,getthejobbyid,getjobstatus,canceljob } from "../controllers/jobcontrollers.js";
import { validator } from "../middlewares/validate.js";
import { createjobschema } from "../validators/jobvalidator.js";

const router=express.Router();


router.get("/:id/status", getjobstatus );

router.patch("/:id/cancel", canceljob);

router.get("/:id", getthejobbyid);

router.post("/createjob", 
    validator(createjobschema),
    createjob
);




export default router;
