import prisma from "../config/db.js";
import { workersonlinegauge,workersbusygauge,workersidlegauge,workersofflinegauge } from "../metrics/metrics.js";

export const registerworker = async (workername)=>{
    
    
    const worker = await prisma.worker.upsert({
        
        where: {
            name: workername
        },

        update: {
            status: "starting",
            currentjobid: null,
            lastheartbeat: new Date()
        },

        create: {
            name: workername,
            status: "starting",
            currentjobid: null,
            lastheartbeat: new Date()
        }
    });

    await refreshworkermetrics();

    return worker;

};


export const updateheartbeat = async (workername)=>{
    return await prisma.worker.update({
        where: {
            name: workername
        },
        data: {
            lastheartbeat: new Date()
        }
    });
};


export const assignjob = async (workername, jobid) =>{

    return await prisma.worker.update({
        where:{
            name: workername
        },
        data: {
            currentjobid: jobid
        }
    });
};


export const clearcurrentjob = async (workername)=>{
    return await prisma.worker.update({
        where:{
            name:workername
        },
        data:{
            currentjobid: null
        }
    })
};

export const updateworkerstatus = async (workername,status)=>{
    const worker = await prisma.worker.update({
        where:{
            name: workername
        },
        data: {
            status: status
        }
    });

    await refreshworkermetrics();

    return worker;
};


export const updateworkerstatistics = async ( workername, processingtime, success )=>{
    return await prisma.worker.update({
        where:{
            name: workername
        },
        data: {
            jobsprocessed: {
                increment:1
            },

            totalprocessingtime:{
                increment:processingtime
            },

            successfuljobs: success ? {
                increment:1
            } : undefined,

            failedjobs: !success ? {
                increment:1
            } : undefined
        }
    });
};


export const electleader = async (workername)=>{
    const leader = await prisma.worker.findFirst({
        where: {
            isleader: true,
            status: {
                not: "offline"
            }
        }
    });

    if(leader){
        return leader;
    }

    return await prisma.worker.update({
        where:{
            name: workername
        },
        data:{
            isleader: true
        }
    });
};


export const isleaderworker = async (workername)=>{
    const worker = await prisma.worker.findUnique({
        where: {
            name: workername
        }
    });

    return worker?.isleader;
};


const refreshworkermetrics = async () => {

    const workers = await prisma.worker.findMany({
        select: {
            status: true
        }
    });

    let online = 0;
    let busy = 0;
    let idle = 0;
    let offline = 0;

    for (const worker of workers) {

        switch (worker.status) {

            case "busy":
                busy++;
                online++;
                break;

            case "idle":
                idle++;
                online++;
                break;

            case "starting":
                online++;
                break;

            case "offline":
                offline++;
                break;

            default:
                break;
        }

    }

    workersonlinegauge.set(online);
    workersbusygauge.set(busy);
    workersidlegauge.set(idle);
    workersofflinegauge.set(offline);

};