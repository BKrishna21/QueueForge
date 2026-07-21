import { iscancelled } from "../services/jobservices.js";


export const throwifcancelled = async (jobid)=>{
    if(await iscancelled(jobid)){
        throw new Error("job cancelled");
    };
};