//console.log("worker running!");
// setInterval(()=>{
//     console.log("Looking for pending jobs....");
// },10000);

import startpolling from "./pollerworker.js";
import logger from "../config/loggerconfig.js";

// console.log("QueueForge worker started!")

logger.info("QueueForge worker started!");

startpolling();







