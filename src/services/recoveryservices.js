import prisma from "../config/db.js";

export const recoverdeadworkers = async () =>{
    const timeout = new Date(Date.now() - 15000);

    const deadworkers = await prisma.worker.findMany({
        where:{
            lastheartbeat:{
                lt:timeout
            },
            status:"active"
        }
    });
    
    for(const worker of deadworkers){
        await prisma.worker.update({
            where:{
                id:worker.id
            },
            data:{
                status:"offline",
                currentjobid: null,
                isleader:false
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


    const currentleader = await prisma.worker.findFirst({
        where: {
            isleader: true,
            status: {
                not: "offline"
            }
        }
    });

    if (!currentleader) {

        const nextleader = await prisma.worker.findFirst({
            where: {
                status: "idle"
            },
            orderBy: {
                startedAt: "asc"
            }
        });

        if (nextleader) {

            await prisma.worker.update({
                where: {
                    id: nextleader.id
                },
                data: {
                    isleader: true
                }
            });

        }

    }



    const expiredjobs = await prisma.job.findMany({
        where: {
            status: "running",
            visibilitytimeout: {
                lt:new Date()
            }
        }
    });


    for(const job of expiredjobs){
        await prisma.job.update({
            where:{
                id: job.id
            },
            data: {
                status: "pending",
                visibilitytimeout: null,
                workername: null
            }
        })
    };

};


