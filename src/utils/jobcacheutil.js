import redis from "../config/redis.js";

export const invalidatejobstatuscache = async (jobid) => {

    const cachekey = `job:${jobid}:status`;
    await redis.del(cachekey);

    console.log(`Job status cache invalidated: ${jobid}`);

};