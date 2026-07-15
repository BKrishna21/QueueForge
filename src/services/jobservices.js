import prisma from "../config/db.js";
import { Prisma } from "@prisma/client";
import logger from "../config/loggerconfig.js";

export const service = async (jobdata)=>{
    const job=await prisma.job.create({
        data:{
            type: jobdata.type,
            payload: jobdata.payload,
            priority: jobdata.priority || "medium",
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
        }
    })
};


export const updatejobstatus = async (id,status)=>{

    return await prisma.job.update({
        where: {
            id:id
        },
        data:{
            status:status
        }
    });
}



export const claimpendingjob = async (workername)=>{

    return await prisma.$transaction( async (tx)=>{

        const jobs=await tx.$queryRaw`
        SELECT *
        FROM "job"
        WHERE status ='pending'
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

        
        return await tx.job.update({
            where:{
                id: job.id
            },
            data:{
                status: "running",
                workername:workername
            }
        });
    });
};

// const job = await tx.job.findFirst({
        //     where: {
        //         status: "pending"
        //     },
        //     orderBy: {
        //         createdAt: "asc"
        //     }
        // });
        // if(!job){
        //     return null;
        // }



export const retryjob = async (job)=>{

    const retrycount = job.retrycount+1;

    if(retrycount > job.maxretries){

        logger.error({
            jobid: job.id
        }, "maximum retries exceeded");


        return await prisma.job.update({
            where:{
                id:job.id
            },
            data:{
                status:"failed",
                retrycount
            }
        });

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
}