import sleep from "../utils/sleeputil.js";
import processjob from "./processorworker.js";
import * as jobservice from "../services/jobservices.js";
import logger from "../config/loggerconfig.js";
import { isleaderworker, updateheartbeat } from "../services/workerservices.js";
import { recoverdeadworkers } from "../services/recoveryservices.js";

let shuttingdown = false;

export const startshutdown = ()=>{
    shuttingdown = true;
}

export const isshuttingdown =()=>{
    return shuttingdown;
}

const startpolling = async (workername)=>{

    logger.info(`${workername} is searching for jobs...`);

    while(!shuttingdown){

        try {
            
            if(await isleaderworker(workername)){
                await recoverdeadworkers();
            }
            

            await updateheartbeat(workername);
            logger.info(`${workername} heartbeat updated!`);


            const jobs = await jobservice.claimpendingjob(workername);

            if(!jobs){
                logger.info("no pending jobs");
            }
            else{

                logger.info({
                    jobId: jobs.id,
                    type: jobs.type
                }, "Job claimed");

                console.log(`the job being executed is: ${jobs.id}`)
                await processjob(jobs, workername);
                
            }

        } catch (error) {
            logger.error(error);
        }

        await sleep(process.env.POLLING_INTERVAL || 10000);
    }
}

export default startpolling;


//try catch here signifies that we should keep retrying the polling
//if we use the global middlewares for handling error then after handling error the polling will stop