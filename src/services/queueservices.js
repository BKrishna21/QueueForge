import prisma from "../config/db.js";
import { Prisma } from "@prisma/client";


export const getqueues = async ()=>{
    
    return await prisma.queue.findMany({
        orderBy:{
            name: "asc"
        }
    });

};

export const getqueuebyname = async (queuename)=>{

      console.log("QUEUE SEARCH:", queuename);

    return await prisma.queue.findUnique({
        where:{
            name: queuename
        }
    });

};


export const getqueuebyid = async (id)=>{

    return await prisma.queue.findUnique({
        where: {
            id: id
        }
    });

};


export const pausequeue = async (queuename) =>{
    return await prisma.queue.update({
        where:{
            name: queuename
        },
        data:{
            status:"paused"
        }
    });
};

export const resumequeue = async (queuename)=>{
    return await prisma.queue.update({
        where:{
            name: queuename
        },
        data: {
            status: "active"
        }
    });
};


export const updatequeueconfiguration = async ( queuename, congiguration )=>{

    return await prisma.queue.update({
        where: {
            name:queuename
        },

        data: congiguration
    });

};

export const resetqueuecounter = async (queueid) => {

    return await prisma.queue.update({
        where: {
            id: queueid
        },
        data: {
            processedjobs: 0,
            lastresettime: new Date()
        }

    });

};

export const incrementprocessedjobs = async (queueid) => {

    return await prisma.queue.update({
        where: {
            id: queueid
        },
        data: {
            processedjobs: {
                increment: 1
            }
        }
    });
};


export const canprocessjob = async (queue) => {

    if (!queue.isratelimited) {
        return true;
    }

    const now = Date.now();
    const lastReset = new Date(queue.lastresettime).getTime();

    if (now - lastReset >= 60000) {
        await resetqueuecounter(queue.id);
        return true;
    }
    return queue.processedjobs < queue.maxjobsperminute;

};


export const getqueuedashboard = async () => {

    const queues = await prisma.queue.findMany({

        orderBy: {

            name: "asc"

        }

    });

    const dashboard = await Promise.all(

        queues.map(async (queue) => {

            const pendingjobs = await prisma.job.count({

                where: {

                    queueid: queue.id,

                    status: "pending"

                }

            });

            const runningjobs = await prisma.job.count({

                where: {

                    queueid: queue.id,

                    status: "running"

                }

            });

            const successjobs = await prisma.job.count({

                where: {

                    queueid: queue.id,

                    status: "success"

                }

            });

            const failedjobs = await prisma.job.count({

                where: {

                    queueid: queue.id,

                    status: "failed"

                }

            });

            return {

                id: queue.id,

                name: queue.name,

                status: queue.status,

                defaultpriority: queue.defaultpriority,

                maxretries: queue.maxretries,

                pollinterval: queue.pollinterval,

                isratelimited: queue.isratelimited,

                maxjobsperminute: queue.maxjobsperminute,

                processedjobs: queue.processedjobs,

                pendingjobs,

                runningjobs,

                successjobs,

                failedjobs

            };

        })

    );

    return dashboard;

};


export const getqueuedetails = async (queuename) => {

    const queue = await prisma.queue.findUnique({

        where: {

            name: queuename

        }

    });

    if (!queue) {

        return null;

    }

    const jobs = await prisma.job.count({

        where: {

            queueid: queue.id

        }

    });

    const pendingjobs = await prisma.job.count({

        where: {

            queueid: queue.id,

            status: "pending"

        }

    });

    const runningjobs = await prisma.job.count({

        where: {

            queueid: queue.id,

            status: "running"

        }

    });

    const successjobs = await prisma.job.count({

        where: {

            queueid: queue.id,

            status: "success"

        }

    });

    const failedjobs = await prisma.job.count({

        where: {

            queueid: queue.id,

            status: "failed"

        }

    });

    return {

        ...queue,

        totaljobs: jobs,

        pendingjobs,

        runningjobs,

        successjobs,

        failedjobs

    };

};


export const getqueuejobs = async (queuename) => {

    const queue = await prisma.queue.findUnique({

        where: {

            name: queuename

        }

    });

    if (!queue) {

        return null;

    }

    return await prisma.job.findMany({

        where: {

            queueid: queue.id

        },

        orderBy: {

            createdAt: "desc"

        }

    });

};