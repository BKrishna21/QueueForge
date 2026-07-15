
import sleep from "../../utils/sleeputil.js";
import logger from "../../config/loggerconfig.js";

const emailhandler = async (job)=>{

    console.log(`sending email to: ${ job.payload.email }`);
    await sleep(3000);

    logger.info("email sent!");    
};

export default emailhandler;