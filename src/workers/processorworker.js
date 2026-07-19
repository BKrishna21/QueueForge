
import logger from "../config/loggerconfig.js";
import * as jobservice from "../services/jobservices.js";
import emailhandler from "./jobhandlers/emailhandler.js";
import { startshutdown } from "./pollerworker.js";
import { assignjob,clearcurrentjob,updateworkerstatistics,updateworkerstatus } from "../services/workerservices.js";
import { incrementprocessedjobs } from "../services/queueservices.js";

let processingjob = false;

export const isprocessingjob = ()=>{
    return processingjob;
};


const processjob = async (job,workername) => {

    const starttime = Date.now();

    processingjob = true;

    logger.info({
        jobid: job.id,
        priority: job.priority,
        runat: job.runAt
    }, "Processing delayed job");
    
    await updateworkerstatus(workername, "busy");

    await assignjob(workername,job.id);
    
    try {

        switch(job.type) {

            case "email": 
                await emailhandler(job);
                break;
            
            default:
                logger.info(`unknown job type: ${job.type}`);

        }

        const processingtime = Date.now()-starttime;
        await updateworkerstatistics( workername,processingtime,true );

        await jobservice.updatejobstatus(job.id, "success");

        await incrementprocessedjobs(job.queueid);

    } catch (error) {
        
        const processingtime=Date.now()-starttime;
        await updateworkerstatistics( workername,processingtime,false );

        logger.error(error);

        await jobservice.retryjob( job,workername,error );

    } finally {

        await  clearcurrentjob(workername);

        await updateworkerstatus(workername, "idle");

        processingjob=false;

    }    
}

export default processjob;

