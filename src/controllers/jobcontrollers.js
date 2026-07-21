import { success } from "zod";
import * as jobservice from "../services/jobservices.js";
import prisma from "../config/db.js";
import asynchandler from "../utils/asynchandlerutil.js";


export const createjob=asynchandler (async (req,res)=>{

        const jobData = req.body;

        console.log("CONTROLLER:", jobData);


        const jobdata = await jobservice.service(jobData);
        res.status(201).json({
            success: true,
            message: "the job has been created!",
            data: jobdata
        });

});


export const getthejobbyid = asynchandler(async(req,res)=>{
    
     const { id } = req.params;

        const findservice = await jobservice.getjobbyid(id);

        if(!findservice){

            const error=new Error("Job not found");
            error.stausCode = 404;
            throw error;

        };

        return res.status(200).json({
            success: true,
            message: "job found",
            execution: {
                status: findservice.status,
                progress: findservice.progress,
                worker: findservice.workername,
                retries: `${findservice.retrycount}/${findservice.maxretries}`
            },
            data: findservice
        });
});


export const getjobstatus = asynchandler(async (req, res) => {

    const { id } = req.params;
    const job = await jobservice.getjobstatus(id);

    if (!job) {

        const error = new Error("Job not found");
        error.statusCode = 404;
        throw error;
    }

    return res.status(200).json({

        success: true,
        data: job

    });
});


export const canceljob = asynchandler(async (req, res) => {

    const { id } = req.params;
    const job = await jobservice.canceljob(id);

    if (!job) {
        const error = new Error("Job not found");
        error.statusCode = 404;
        throw error;
    }

    return res.status(200).json({
        success: true,
        message: "Job cancelled successfully.",
        data: job
    });

});