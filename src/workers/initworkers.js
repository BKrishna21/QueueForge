//console.log("worker running!");
// setInterval(()=>{
//     console.log("Looking for pending jobs....");
// },10000);

import prisma from "../config/db.js";
import startpolling, { startshutdown } from "./pollerworker.js";
import logger from "../config/loggerconfig.js";
import { electleader, registerworker,updateworkerstatus } from "../services/workerservices.js";
import { isprocessingjob } from "./processorworker.js";


const workername = process.env.WORKER_NAME || "worker";
const queuename  = process.env.QUEUE_NAME  || "queue";

const startworker = async ()=>{
    try {

        await registerworker(workername);
        logger.info(`${workername} registered successfully`);

        await electleader(workername);
        logger.info(`${workername} is elected as leader`);
        
        await updateworkerstatus(workername,"idle");
        logger.info(`${workername} is ready`);

        await startpolling( workername,queuename );

    } catch (error) {
        logger.error(error);

        process.exit(1);
    }
}

startworker();


const gracefulshutdown = async (signal)=>{
    logger.info(`${signal} received`);

    startshutdown();

    await updateworkerstatus(
        workername,
        "stopping"
    );

    while(isprocessingjob()){
        logger.info("waiting for current job...");

        await new Promise(
            resolve => setTimeout(resolve,3000)
        );
    }

    await updateworkerstatus(workername, "offline");

    await prisma.$disconnect();
    
    logger.info("worker shutdown complete");

    process.exit(0);
};


process.on(

    "SIGINT",

    () => gracefulshutdown("SIGINT")

);

process.on(

    "SIGTERM",

    () => gracefulshutdown("SIGTERM")

);













