import { success } from "zod";


export const errorhandler = (err,req,res,next)=>{
    
    console.error(err);

    return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
};