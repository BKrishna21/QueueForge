// const processjob = async (job)=>{
//     console.log(`Processing the job: ${job.id}`);
// };
// export default processjob;


import logger from "../config/loggerconfig.js";
import * as jobservice from "../services/jobservices.js";
import emailhandler from "./jobhandlers/emailhandler.js";

const processjob = async (job) => {
    //await jobservice.updatejobstatus(job.id, "running");

    switch(job.type) {
        case "email": 
            await emailhandler(job);
            break;
        
        default:
            logger.info(`unknown job type: ${job.type}`);
    }
    
    //await jobservice.updatejobstatus(job.id, "success");
}

export default processjob;

