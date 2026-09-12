// import { createClient } from "redis";

// const redis = createClient({
//     url: process.env.REDIS_URL
// });

// redis.on("error", (error) => {
//     console.error("Redis Client Error:", error);
// });

// export default redis;


// import "dotenv/config";
// import { createClient } from "redis";

// const redis = createClient({
//     url: process.env.REDIS_URL
// });

// redis.on("error", (error) => {
//     console.error("Redis Client Error:", error);
// });

// export default redis;



import "dotenv/config";
import { createClient } from "redis";

const redis = createClient({
    url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
});

redis.on("error", (error) => {
    console.error("Redis Client Error:", error);
});

redis.on("connect", () => {
    console.log("Redis connecting...");
});

redis.on("ready", () => {
    console.log("Redis is ready!");
});

redis.on("reconnecting", () => {
    console.log("Redis reconnecting...");
});

export const connectRedis = async () => {
    if (!redis.isOpen) {
        await redis.connect();
    }
};

export default redis;
