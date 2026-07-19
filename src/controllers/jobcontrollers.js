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


    // try {   
    //     const jobData = req.body;
    //     const jobdata = await jobservice.service(jobData);
    //     res.status(201).json({
    //         success: true,
    //         message: "the job has been created!",
    //         data: jobdata
    //     })
    // } catch (error) {
    //     // res.status(500).json({
    //     //     success: false,
    //     //     message: error.message
    //     // })
    //     next(error);
    // }

});


// export const createjob = asynchandler(async (req,res)=>{

//     console.log("HEADERS:", req.headers);
//     console.log("BODY:", req.body);

//     const jobData = req.body;

//     const jobdata = await jobservice.service(jobData);

//     res.status(201).json({
//         success:true,
//         data:jobdata
//     });

// });


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
            data: findservice
        });
});