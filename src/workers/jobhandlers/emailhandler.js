
import sleep from "../../utils/sleeputil.js";

const emailhandler = async (job)=>{

    console.log(`sending email to: ${ job.payload.email }`);
    await sleep(3000);

    console.log("email sent!");

};

export default emailhandler;