//console.log("worker running!");
// setInterval(()=>{
//     console.log("Looking for pending jobs....");
// },10000);

import startpolling from "./pollerworker.js";
import logger from "../config/loggerconfig.js";
import { registerworker } from "../services/workerservices.js";

const workername = process.env.WORKER_NAME || "worker";

console.log("inside the initworker.js file:",workername);
console.log("name from env file",process.env.WORKER_NAME);

const startworker = async ()=>{
    try {

        await registerworker(workername);
        logger.info(`${workername} registered successfully`);

        await startpolling(workername);

    } catch (error) {
        logger.error(error);

        process.exit(1);
    }
}

startworker();













