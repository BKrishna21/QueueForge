import prisma from "../config/db.js";

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