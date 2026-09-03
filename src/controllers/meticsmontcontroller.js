import { register } from "../metrics/metrics.js";

export const getmetrics = async (req , res)=>{

    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
    
}