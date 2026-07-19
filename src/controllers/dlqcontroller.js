import asynchandler from "../utils/asynchandlerutil.js";
import * as dlqservice from "../services/dlqservices.js";

export const getalldeadjobs = asynchandler(async (req, res) => {

    const jobs = await dlqservice.getalldeadjobs();

    return res.status(200).json({
        success: true,
        count: jobs.length,
        data: jobs
    });

});

export const getdeadjob = asynchandler(async (req, res) => {

    const { id } = req.params;

    const job = await dlqservice.getdeadjob(id);

    if (!job) {
        const error = new Error("Dead letter record not found");
        error.statusCode = 404;
        throw error;
    }

    return res.status(200).json({
        success: true,
        data: job
    });

});

export const replaydeadjob = asynchandler(async (req, res) => {

    const { id } = req.params;

    const job = await dlqservice.replaydeadjob(id);

    if (!job) {
        const error = new Error("Dead letter record not found");
        error.statusCode = 404;
        throw error;
    }

    return res.status(200).json({
        success: true,
        message: "Job replayed successfully.",
        data: job
    });

});

export const deletedeadjob = asynchandler(async (req, res) => {

    const { id } = req.params;

    await dlqservice.deletedeadjob(id);

    return res.status(200).json({
        success: true,
        message: "Dead letter record deleted successfully."
    });

});