import prisma from "../config/db.js";

export const getoverview = async () => {

    const [
        totalworkers,
        idleworkers,
        busyworkers,
        offlineworkers,
        leader,
        pendingjobs,
        runningjobs,
        successjobs,
        failedjobs
    ] = await Promise.all([

        prisma.worker.count(),

        prisma.worker.count({
            where: {
                status: "idle"
            }
        }),

        prisma.worker.count({
            where: {
                status: "busy"
            }
        }),

        prisma.worker.count({
            where: {
                status: "offline"
            }
        }),

        prisma.worker.findFirst({
            where: {
                isleader: true
            },
            select: {
                name: true
            }
        }),

        prisma.job.count({
            where: {
                status: "pending"
            }
        }),

        prisma.job.count({
            where: {
                status: "running"
            }
        }),

        prisma.job.count({
            where: {
                status: "success"
            }
        }),

        prisma.job.count({
            where: {
                status: "failed"
            }
        })

    ]);

    return {

        workers: {

            total: totalworkers,

            idle: idleworkers,

            busy: busyworkers,

            offline: offlineworkers,

            leader: leader?.name || null

        },

        jobs: {

            pending: pendingjobs,

            running: runningjobs,

            success: successjobs,

            failed: failedjobs

        }

    };

};


export const getworkers = async () => {

    const workers = await prisma.worker.findMany({

        orderBy: {

            startedAt: "asc"

        }

    });

    return workers.map(worker => ({

        ...worker,

        averageprocessingtime:

            worker.jobsprocessed === 0

                ? 0

                : Math.round(

                    worker.totalprocessingtime /

                    worker.jobsprocessed

                )

    }));

};


export const getworker = async (workername) => {

    const worker = await prisma.worker.findUnique({

        where: {

            name: workername

        }

    });

    if (!worker) {

        return null;

    }

    return {

        ...worker,

        averageprocessingtime:

            worker.jobsprocessed === 0

                ? 0

                : Math.round(

                    worker.totalprocessingtime /

                    worker.jobsprocessed

                )

    };

};