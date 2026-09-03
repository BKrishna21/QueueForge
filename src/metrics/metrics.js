import client from "prom-client";


export const register = new client.Registry();


client.collectDefaultMetrics({
    register
});


//job metrics

export const jobscreatedcounter = new client.Counter({
    name: "queueforge_jobs_created_total",
    help: "Total number of jobs created"
});

export const jobscompletedcounter = new client.Counter({
    name: "queueforge_jobs_completed_total",
    help: "Total number of jobs completed"
});

export const jobsfailedcounter = new client.Counter({
    name: "queueforge_jobs_failed_total",
    help: "Total number of jobs failed"
});

export const jobscancelledcounter = new client.Counter({
    name: "queueforge_jobs_cancelled_total",
    help: "Total number of jobs cancelled"
});

export const jobsretriedcounter = new client.Counter({
    name: "queueforge_jobs_retried_total",
    help: "Total number of retries"
});

export const jobsdlqcounter = new client.Counter({
    name: "queueforge_jobs_dlq_total",
    help: "Total number of jobs moved to the DLQ"
});


export const completedjobsgauge = new client.Gauge({
    name: "queueforge_completed_jobs",
    help: "Current completed jobs"
});

export const failedjobsgauge = new client.Gauge({
    name: "queueforge_failed_jobs",
    help: "Current failed jobs"
});

export const cancelledjobsgauge = new client.Gauge({
    name: "queueforge_cancelled_jobs",
    help: "Current cancelled jobs"
});

export const deadjobsgauge = new client.Gauge({
    name: "queueforge_dead_jobs",
    help: "Current dead jobs"
});



//worker metrics

export const workersonlinegauge = new client.Gauge({
    name: "queueforge_workers_online",
    help: "Current number of online workers"
});

export const workersbusygauge = new client.Gauge({
    name: "queueforge_workers_busy",
    help: "Current number of busy workers"
});

export const workersidlegauge = new client.Gauge({
    name: "queueforge_workers_idle",
    help: "Current number of idle workers"
});

export const workersofflinegauge = new client.Gauge({
    name: "queueforge_workers_offline",
    help: "current number of offline workers"
});


//queue metrics

export const pendingjobsgauge = new client.Gauge({
    name: "queueforge_pending_jobs",
    help: "Current number of pending jobs"
});

export const runningjobsgauge = new client.Gauge({
    name: "queueforge_running_jobs",
    help: "Current number of running jobs"
});

//processing time

export const jobprocessinghistogram = new client.Histogram({
    name: "queueforge_job_processing_duration_seconds",
    help: "Job processing duration",

    buckets: [
        0.1,
        0.5,
        1,
        2,
        5,
        10,
        30,
        60
    ]
});




// export const updatejobstatemetrics = (
//     previousStatus,
//     currentStatus
// ) => {

//     const decrement = (status) => {

//         switch(status){

//             case "pending":
//                 pendingjobsgauge.dec();
//                 break;

//             case "running":
//                 runningJobsGauge.dec();
//                 break;

//             case "success":
//                 completedJobsGauge.dec();
//                 break;

//             case "failed":
//                 failedJobsGauge.dec();
//                 break;

//             case "cancelled":
//                 cancelledJobsGauge.dec();
//                 break;

//             case "dead":
//                 deadJobsGauge.dec();
//                 break;

//         }

//     };

//     const increment = (status) => {

//         switch(status){

//             case "pending":
//                 pendingJobsGauge.inc();
//                 break;

//             case "running":
//                 runningJobsGauge.inc();
//                 break;

//             case "success":
//                 completedJobsGauge.inc();
//                 break;

//             case "failed":
//                 failedJobsGauge.inc();
//                 break;

//             case "cancelled":
//                 cancelledJobsGauge.inc();
//                 break;

//             case "dead":
//                 deadJobsGauge.inc();
//                 break;

//         }

//     };

//     if(previousStatus){
//         decrement(previousStatus);
//     }

//     increment(currentStatus);

// };




export const updatejobstatemetrics = (
    previousstatus,
    currentstatus
) => {

    const decrement = (status) => {

        switch (status) {

            case "pending":
                pendingjobsgauge.dec();
                break;

            case "running":
                runningjobsgauge.dec();
                break;

            case "success":
                completedjobsgauge.dec();
                break;

            case "failed":
                failedjobsgauge.dec();
                break;

            case "cancelled":
                cancelledjobsgauge.dec();
                break;

            case "dead":
                deadjobsgauge.dec();
                break;

        }

    };

    const increment = (status) => {

        switch (status) {

            case "pending":
                pendingjobsgauge.inc();
                break;

            case "running":
                runningjobsgauge.inc();
                break;

            case "success":
                completedjobsgauge.inc();
                break;

            case "failed":
                failedjobsgauge.inc();
                break;

            case "cancelled":
                cancelledjobsgauge.inc();
                break;

            case "dead":
                deadjobsgauge.inc();
                break;

        }

    };

    if (previousstatus) {
        decrement(previousstatus);
    }

    increment(currentstatus);

};



//register everything

register.registerMetric(jobscreatedcounter);
register.registerMetric(jobscompletedcounter);
register.registerMetric(jobsfailedcounter);
register.registerMetric(jobscancelledcounter);
register.registerMetric(jobsretriedcounter);
register.registerMetric(jobsdlqcounter);
register.registerMetric(completedjobsgauge);
register.registerMetric(failedjobsgauge);
register.registerMetric(cancelledjobsgauge);
register.registerMetric(deadjobsgauge);

register.registerMetric(workersonlinegauge);
register.registerMetric(workersbusygauge);
register.registerMetric(workersidlegauge);
register.registerMetric(workersofflinegauge);

register.registerMetric(pendingjobsgauge);
register.registerMetric(runningjobsgauge);

register.registerMetric(jobprocessinghistogram);