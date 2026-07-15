import prisma from "../config/db.js";


export const registerworker = async (workername)=>{
    return await prisma.worker.upsert({
        
        where: {
            name: workername
        },

        update: {
            status: "active",
            currentjobid: null,
            lastheartbeat: new Date()
        },

        create: {
            name: workername,
            status: "active",
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

    console.log(workername);
    console.log(process.env.WORKER_NAME);

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
}