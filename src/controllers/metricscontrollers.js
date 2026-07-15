import * as metricsservice from "../services/metricsservices.js";

export const getworkers = async (req,res)=>{
    const workers = await metricsservice.getworkers();

    return res.status(200).json(workers);
};

export const getindvworker = async (req,res)=>{
    const worker = await metricsservice.getworkerbyname(
        req.params.name
    );

    if(!worker){
        return res.status(404).json({ 
            message: "worker not found!"
        })
    }

    return res.status(200).json(worker);
}

export const getqueuemetrics = async (req,res)=>{
    const queuemetrics = await metricsservice.getqueuemetrics();

    return res.status(200).json(queuemetrics);
}


export const getfailedjobs = async (req, res) => {

    const jobs = await metricsservice.getfailedjobs();

    res.status(200).json(jobs);

};