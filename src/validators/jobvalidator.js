import { z } from "zod";

export const createjobschema = z.object({
    type: z.string().min(1, "job type is required!!"),

    payload:z.object({}).passthrough()
    
});