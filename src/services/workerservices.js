import prisma from "../config/db.js";


export const registerworker = async (workername)=>{
    return await prisma.worker.upsert({
        
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
    return await prisma.worker.update({
        where:{
            name: workername
        },
        data: {
            status: status
        }
    });
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