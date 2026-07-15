
import logger from "../config/loggerconfig.js";
import * as jobservice from "../services/jobservices.js";
import emailhandler from "./jobhandlers/emailhandler.js";
import { assignjob,clearcurrentjob } from "../services/workerservices.js";

const processjob = async (job,workername) => {

    //await jobservice.updatejobstatus(job.id, "running");

    logger.info({
        jobId: job.id,
        priority: job.priority,
        runAt: job.runAt
    }, "Processing delayed job");
    

    await assignjob(workername,job.id);
    
    try {
        switch(job.type) {
            case "email": 
                await emailhandler(job);
                break;
            
            default:
                logger.info(`unknown job type: ${job.type}`);
        }
        
        await jobservice.updatejobstatus(job.id, "success");

    } catch (error) {

        // await jobservice.updatejobstatus(job.id, "failed");
        // throw error;

        logger.error(error);
        await jobservice.retryjob(job);

    } finally {

        await  clearcurrentjob(workername);

    }    
}

export default processjob;

