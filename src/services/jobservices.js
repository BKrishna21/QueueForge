import prisma from "../config/db.js";
import { Prisma } from "@prisma/client";

export const service = async (jobdata)=>{
    const job=await prisma.job.create({
        data: jobdata
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




// export const updatejobstatus = async (id,status)=>{

//     return await prisma.job.update({
//         where: {
//             id:id
//         },
//         data:{
//             status:status
//         }
//     });
// }



export const claimpendingjob = async (workername)=>{

    return await prisma.$transaction( async (tx)=>{

        const jobs=await tx.$queryRaw`
        SELECT *
        FROM "job"
        WHERE status ='pending'
        ORDER BY "createdAt"
        LIMIT 1
        FOR UPDATE SKIP LOCKED
        `;
        
        if(jobs.length === 0){
            return null;
        }

        const job = jobs[0];

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