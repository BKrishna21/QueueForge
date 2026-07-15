import prisma from "../config/db.js";

export const recoverdeadworkers = async () =>{
    const timeout = new Date(Date.now() - 15000);

    const deadworkers = await prisma.worker.findMany({
        where:{
            lastheartbeat:{
                lt:timeout
            },
            status: "active"
        }
    });
    
    for(const worker of deadworkers){
        await prisma.worker.update({
            where:{
                id:worker.id
            },
            data:{
                status:"offline",
                currentjobid: null
            }
        });

        await prisma.job.updateMany({
            where:{
                workername: worker.name,
                status:"running"
            },
            data:{
                status:"pending",
                workername:null
            }
        });
    }
};