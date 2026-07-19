import asynchandler from "../utils/asynchandlerutil.js";
import * as queueservice from "../services/queueservices.js";
import { success } from "zod";

export const getallqueues = asynchandler (async (req,res) =>{

    const queues =await queueservice.getqueues();

    return res.status(200).json({
        success: true,
        data: queues
    });

});

export const pausequeue = asynchandler(async (req, res) => {

    const { name } = req.params;
    const queue = await queueservice.getqueuebyname(name);

    if (!queue) {

        const error = new Error("Queue not found");
        error.statusCode = 404;
        throw error;

    }

    const updated = await queueservice.pausequeue(name);

    return res.status(200).json({

        success: true,
        message: "queue paused successfully",
        data: updated

    });

});

export const resumequeue = asynchandler(async (req, res) => {

    const { name } = req.params;
    const queue = await queueservice.getqueuebyname(name);

    if (!queue) {

        const error = new Error("Queue not found");
        error.statusCode = 404;
        throw error;

    }

    const updated = await queueservice.resumequeue(name);

    return res.status(200).json({

        success: true,
        message: "Queue resumed successfully.",
        data: updated

    });

});

export const updatequeueconfiguration = asynchandler(async (req, res) => {

    const { name } = req.params;
    const queue = await queueservice.getqueuebyname(name);

    if (!queue) {

        const error = new Error("Queue not found");
        error.statusCode = 404;
        throw error;

    }

    const updated = await queueservice.updatequeueconfiguration( name,req.body );

    return res.status(200).json({

        success: true,
        message: "Queue configuration updated.",
        data: updated

    });

});

//DASHBOARD

export const getqueuedashboard = asynchandler(async (req, res) => {

    const dashboard = await queueservice.getqueuedashboard();

    return res.status(200).json({

        success: true,

        data: dashboard

    });

});



export const getqueuedetails = asynchandler(async (req, res) => {

    const { name } = req.params;

    const details = await queueservice.getqueuedetails(name);

    if (!details) {

        const error = new Error("Queue not found");

        error.statusCode = 404;

        throw error;

    }

    return res.status(200).json({

        success: true,

        data: details

    });

});


export const getqueuejobs = asynchandler(async (req, res) => {

    const { name } = req.params;

    const jobs = await queueservice.getqueuejobs(name);

    if (!jobs) {

        const error = new Error("Queue not found");

        error.statusCode = 404;

        throw error;

    }

    return res.status(200).json({

        success: true,

        data: jobs

    });

});