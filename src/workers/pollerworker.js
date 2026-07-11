import sleep from "../utils/sleeputil.js";
import processjob from "./processorworker.js";
import * as jobservice from "../services/jobservices.js";
import logger from "../config/loggerconfig.js";

const Polling_interval=5000;

const startpolling = async ()=>{

    // console.log("worker started");
    logger.info("worker started!");


    while(true){

        try {
            const jobs = await jobservice.claimpendingjob();

            if(!jobs){
                logger.info("no pending jobs");
            }
            else{

                logger.info({
                    jobId: jobs.id,
                    type: jobs.type
                }, "Job claimed");

                console.log(`the job being executed is: ${jobs.id}`)
                await processjob(jobs);
                
            }

        } catch (error) {
            logger.error(error);
        }

        await sleep(Polling_interval);
    }
}

export default startpolling;



//try catch here signifies that we should keep retrying the polling
//if we use the global middlewares for handling error then after handling error the polling will stop