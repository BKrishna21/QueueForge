
// import dotenv from "dotenv";
// import approuter from "./app.js";

// dotenv.config();
// const port=process.env.PORT || 5000;

// approuter.listen(port, ()=>{
//     console.log(`Server is listening at port: ${port}`);
// });



import dotenv from "dotenv";
import app from "./app.js";
import redis from "./config/redis.js";

dotenv.config();

const port = process.env.PORT || 5000;

const startserver = async () => {
    try {
        await redis.connect();

        console.log("Redis connected successfully");

        app.listen(port, () => {
            console.log(`Server is listening at port: ${port}`);
        });

    } catch (error) {
        console.error("Redis connection failed:", error);
        process.exit(1);
    }
};

startserver();
