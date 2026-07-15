import express from 'express';
import { success } from 'zod';
import prisma from './config/db.js';
import jobroutes from "./routes/jobroutes.js";
import { errorhandler } from './middlewares/errorhandler.js';
import metricsroutes from "./routes/metricsroutes.js";


const app=express();

app.use(express.json());

app.get("/", (req,res)=>{
    res.status(200).json({
        message: "welcome to my Project",
    });
});


app.get("/dbconnect-test", async (req,res)=>{
    try {
        await prisma.$connect();
        res.json({
            success:true,
            message:"database connected successfully"
        });
        
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.use("/jobs",jobroutes);

app.use("/api", metricsroutes);

app.use(errorhandler);

export default app;