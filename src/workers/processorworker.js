
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

    await jobservice.markjobstarted( job.id,job.queue.timeout );

    await jobservice.updatejobprogress( job.id, 0 );
    

    let timeoutid;

    try {

        const handlerpromise = (async()=>{
            switch(job.type){
                case "email":
                    return await emailhandler(job);
                
                default: 
                    throw new Error(
                        `unknown job type ${job.type}`
                    );
            }
        })();

        const timeoutpromise =
        new Promise((_, reject) => {

            timeoutid = setTimeout(() => {

                reject(
                    new Error(`Job timed out after ${job.queue.timeout} ms`)
                );
            }, job.queue.timeout);

        });

        const result = 
        await Promise.race([
            handlerpromise,
            timeoutpromise
        ]);

        clearTimeout(timeoutid);

        const processingtime = Date.now()-starttime;
        await updateworkerstatistics( workername,processingtime,true );

        await jobservice.updatejobstatus( job.id, "success",result );

        await jobservice.markjobcompleted(job.id);

        await incrementprocessedjobs(job.queueid);

    } catch (error) {
        clearTimeout(timeoutid);


        const processingtime=Date.now()-starttime;
        await updateworkerstatistics( workername,processingtime,false );

        logger.error({
            jobid:job.id,
            error:error.message
        },"Job execution failed");

        // await jobservice.retryjob( job,workername,error );

        if (error.message === "Job cancelled") {
            logger.info({
                jobid: job.id
            }, "Job cancelled by user.");
        }
        else {
            await jobservice.retryjob(job,workername,error);
        }

    } finally {

        await  clearcurrentjob(workername);

        await updateworkerstatus(workername, "idle");

        processingjob=false;

    }    
}

export default processjob;

