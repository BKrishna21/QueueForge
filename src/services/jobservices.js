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


// export const findpendingjobs = async ()=>{
//     return await prisma.job.findFirst({
//         where:{
//             status:"pending"
//         },
//         orderBy:{
//             createdAt:"asc"
//         }
//     });
// };

// export const updatejobstatus = async (id,status)=>{

//     return await prisma.job.update({
//         where: {
//             id
//         },
//         data:{
//             status
//         }
//     });
// }


//combined the above find and update functions
export const claimpendingjob = async ()=>{

    return await prisma.$transaction( async (tx)=>{
        
        const job = await tx.job.findFirst({
            where: {
                status: "pending"
            },
            orderBy: {
                createdAt: "asc"
            }
        });

        if(!job){
            return null;
        }

        return await tx.job.update({
            where:{
                id: job.id
            },
            data:{
                status: "success"
            }
        });
    });
};