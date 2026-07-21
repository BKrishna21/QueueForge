import prisma from "../config/db.js";
import { Prisma } from "@prisma/client";
import logger from "../config/loggerconfig.js";
import { canprocessjob, getqueuebyname } from "./queueservices.js";
import { movetodlq } from "./dlqservices.js";


// const VISIBILITY_TIMEOUT = 
// Number( process.env.VISIBILITY_TIMEOUT ) || 30000;

const JOB_TIMEOUT = 
Number( process.env.JOB_TIMEOUT ) || 30000;

export const service = async (jobdata)=>{

    const queue = await getqueuebyname(jobdata.queue);

    console.log("JOB DATA RECEIVED:", jobdata);
    console.log("QUEUE VALUE:", jobdata.queue);

    if(!queue){
        throw new Error("queue not found");
    }


    const job=await prisma.job.create({
        data:{

            queueid: queue.id,
            type: jobdata.type,
            payload: jobdata.payload,
            priority: jobdata.priority || queue.defaultpriority,
            maxretries: queue.maxretries,
            status: "pending",
            runat: jobdata.runat
                ? new Date(jobdata.runat)
                : new Date()
            
        } 
    });
    
    return job;
};

export const getjobbyid = async (jobid)=>{
    return await prisma.job.findUnique({
        where: {
            id: jobid
        },
        include: {
            queue:{
                select:{
                    name: true
                }
            }
        }
    });
};


export const updatejobstatus = async (id,status,result=null )=>{

    const updatedata = {
        status,
        visibilitytimeout:null,
        workername:null
    }

    if(status === "success"){
        updatedata.progress = 100;
    }

    if( result !== null){
        updatedata.result=result;
    }

    return await prisma.job.update({
        where: {
            id:id
        },
        data:updatedata
    });
}



export const claimpendingjob = async ( workername,queuename )=>{

    const queue = await getqueuebyname(queuename);
    if(!queue){
        throw new Error("queue not found");
    }

    const allowed = await canprocessjob(queue);
    if(!allowed){
        logger.info(`${queuename} queue reached rate limit.`);
        return null;
    }
    
    if(queue.status === "paused"){

        logger.info(`${queuename} queue is paused.`);
        return null;

    }

    const queueid = queue.id;

    return await prisma.$transaction( async (tx)=>{

        const jobs=await tx.$queryRaw`
        SELECT *
        FROM "job"
        WHERE status ='pending'
        AND "queueid" = ${queueid}
        AND "runat" <= NOW()
        ORDER BY 
        CASE
            WHEN priority='high' THEN 1
            WHEN priority='medium' THEN 2
            WHEN priority='low' THEN 3
        END,        
        "createdAt"
        LIMIT 1
        FOR UPDATE SKIP LOCKED
        `;
        
        if(jobs.length === 0){
            return null;
        }

        const job = jobs[0];

        
        // return await tx.job.update({
        //     where:{
        //         id: job.id
        //     },
        //     data:{
        //         status: "running",
        //         workername:workername,

        //         visibilitytimeout: new Date( Date.now() + VISIBILITY_TIMEOUT )
        //     }
        // });


        return await tx.job.update({
            where: {
                id: job.id
            },
            data: {
                status: "running",
                workername: workername,
                visibilitytimeout: new Date(Date.now() + VISIBILITY_TIMEOUT)
            },
            include: {
                queue: true
            }
        });
    });
};


export const retryjob = async ( job,workername,error )=>{

    const retrycount = job.retrycount+1;

    if(retrycount >= job.maxretries){

        console.log("MOVING TO DLQ");

        logger.error({
            jobid: job.id
        }, "maximum retries exceeded");


        await movetodlq( job,workername,error,retrycount );

        return;

    }
    
    const delay = Math.pow(2,retrycount)*1000;

    const runat = new Date(Date.now() + delay);

    logger.warn({
        jobid: job.id,
        retrycount,
        nextrun: runat
    },"Job scheduled for retry");


    return await prisma.job.update({
        where:{
            id:job.id
        },
        data:{
            retrycount,
            status:"pending",
            runat,
            workername:null
        }
    });
};


export const updatejobprogress = async (jobid,progress) => {
    const job = await prisma.job.update({
        where:{
            id:jobid
        },
        data: {
            progress
        }
    });

    logger.info({
        jobid: jobid,
        progress
    }, "Job progress updated");

    return job;

};

export const getjobstatus = async (jobid) => {
    return await prisma.job.findUnique({
        where: {
            id: jobid
        },

        select: {

            id: true,
            status: true,
            progress: true,
            workername: true,
            createdAt: true,
            updatedAt: true,
            retrycount: true,
            maxretries: true,
            priority: true,
            runat: true,
            startedat: true,
            completedat: true,
            timeoutat: true,
            queue: {
                select: {
                    name: true
                }
            }
        }
    });
};


export const updatejobresult = async (jobid,result) => {

    return await prisma.job.update({
        where: {
            id: jobid
        },
        data: {
            result
        }
    });

};

export const markjobstarted = async ( jobid,timeout )=>{

    const timeoutAt = new Date(
        Date.now()+timeout
    );

    return await prisma.job.update({
        where:{
            id:jobid
        },
        data:{
            startedat:new Date(),
            timeoutat:timeoutAt
        }
    });
};


export const markjobcompleted = async(jobid)=>{

    return await prisma.job.update({
        where:{
            id:jobid
        },
        data:{
            completedat:new Date(),
            timeoutat:null
        }
    });
};




export const canceljob = async (jobid) => {

    const job = await prisma.job.findUnique({
        where: {
            id: jobid
        }
    });

    if (!job) {
        return null;
    }
    if (["success", "failed", "cancelled"].includes(job.status)) {
        return job;
    }
    return await prisma.job.update({
        where: {
            id: jobid
        },
        data: {
            status: "cancelled",
            workername: null,
            visibilitytimeout: null
        }
    });
};

export const iscancelled = async (jobid) => {

    const job = await prisma.job.findUnique({

        where: {
            id: jobid
        },

        select: {
            status: true
        }

    });

    return job?.status === "cancelled";

};