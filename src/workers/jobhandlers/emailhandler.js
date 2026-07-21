
import sleep from "../../utils/sleeputil.js";
import logger from "../../config/loggerconfig.js";
import { updatejobprogress,iscancelled } from "../../services/jobservices.js";
import { throwifcancelled } from "../../utils/cancellationutil.js";





const emailhandler = async (job)=>{

    logger.info("preparing email...");
    await updatejobprogress(job.id, 20);
    await sleep(1000);
    await throwIfCancelled(job.id);

    logger.info("connecting to smtp server...");
    await updatejobprogress(job.id, 40);
    await sleep(1000);
    await throwIfCancelled(job.id);

    logger.info(`sending email to: ${ job.payload.email }`);
    await updatejobprogress(job.id, 70);
    await sleep(1000);
    await throwIfCancelled(job.id);

    logger.info("waiting for smtp response...");
    await updatejobprogress(job.id, 90);
    await sleep(1000);
    await throwIfCancelled(job.id);

    // throw new Error("Testing Dead Letter Queue");

    logger.info("email sent!"); 
    await updatejobprogress(job.id, 100);


    return {
        recipient: job.payload.email,
        provider: "smtp",
        delivered: true,
        message: "email sent successfully"
    };
       
};

export default emailhandler;