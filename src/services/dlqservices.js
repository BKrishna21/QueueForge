import prisma from "../config/db.js";

// export const movetodlq = async (

//     job,
//     workername,
//     error,
//     retrycount


// ) => {

//     await prisma.deadletterrecord.create({

//         data: {

//             retrycount: retrycount,

//             jobid: job.id,

//             failedbyworker: workername,

//             errormessage: error.message

//         }

//     });

//     return await prisma.job.update({

//         where: {

//             id: job.id

//         },

//         data: {

//             status: "dead",

//             errormessage: error.message,

//             visibilitytimeout: null,

//             workername: null

//         }

//     });

// };



export const movetodlq = async (
    job,
    workername,
    error,
    retrycount
) => {

    return await prisma.$transaction(async (tx) => {

        await tx.deadletterrecord.create({
            data: {
                retrycount,
                jobid: job.id,
                failedbyworker: workername,
                errormessage: error.message
            }
        });

        return await tx.job.update({
            where: {
                id: job.id
            },
            data: {
                retrycount,
                status: "dead",
                errormessage: error.message,
                visibilitytimeout: null,
                workername: null
            }
        });

    });

};



export const getalldeadjobs = async () => {

    return await prisma.deadletterrecord.findMany({

        include: {

            job: {

                include: {

                    queue: true

                }

            }

        },

        orderBy: {

            failedat: "desc"

        }

    });

};

export const getdeadjob = async (id) => {

    return await prisma.deadletterrecord.findUnique({

        where: {

            id

        },

        include: {

            job: {

                include: {

                    queue: true

                }

            }

        }

    });

};

export const replaydeadjob = async (id) => {

    const deadjob = await prisma.deadletterrecord.findUnique({

        where: {

            id

        },

        include: {

            job: true

        }

    });

    if (!deadjob) {

        return null;

    }

    const updatedjob = await prisma.job.update({
        where: {
            id: deadjob.job.id
        },
        data: {
            status: "pending",
            retrycount: 0,
            workername: null,
            errormessage: null,
            visibilitytimeout: null,
            runat: new Date()
        }
    });

    await prisma.deadletterrecord.delete({

        where: {

            id

        }

    });

    return updatedjob;

};

export const deletedeadjob = async (id) => {

    return await prisma.deadletterrecord.delete({

        where: {

            id

        }

    });

};