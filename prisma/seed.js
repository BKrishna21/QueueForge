import { Prisma } from "@prisma/client";
import prisma from "../src/config/db.js";

async function main() {
    const queues = [
        {
            name: "email",
            description: "Handles email sending jobs"
        },

        {
            name: "video",
            description: "Handles video processing jobs"
        },

        {
            name: "image",
            description: "Handles image processing jobs"
        },

        {
            name: "payment",
            description: "Handles payment jobs"
        },

        {
            name: "notification",
            description: "Handles notification jobs"
        },

        {
            name: "analytics",
            description: "Handles analytics jobs"
        }
    ];

    for(const queue of queues){
        await prisma.queue.upsert({
            where:{
                name:queue.name
            },
            update: {},
            create: queue
        });
    }
}

main()
.then(async ()=>{

    console.log("Queues created successfully.");

    await prisma.$disconnect();
})
.catch( async (error)=>{

    console.log(error);
    await prisma.$disconnect();
    process.exit(1);
    
});

