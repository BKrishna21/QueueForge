
import prisma from "../config/db.js";

export const getworkers=async ()=>{

    return await prisma.worker.findMany({
        orderBy:{
            name:"asc"
        }
    });
};

export const getworkerbyname= async (workername)=>{

    return await prisma.worker.findUnique({
        where: {
            name:workername
        }
    });

};

export const getqueuemetrics = async ()=>{

    const pending = await prisma.job.count({
        where:{
            status:"pending"
        }
    });

    const running = await prisma.job.count({
        where:{
            status:"running"
        }
    });

    const success = await prisma.job.count({
        where: {
            status: "success"
        }
    });

    const failed = await prisma.job.count({
        where: {
            status: "failed"
        }
    });

    return {
        pending,
        running,
        success,
        failed,
        total: pending+running+success+failed
    };
};

export const getfailedjobs = async ()=>{
    return await prisma.job.findMany({
        where: {
            status:"failed"
        },
        orderBy:{
            updatedAt:"desc"
        }
    });
};