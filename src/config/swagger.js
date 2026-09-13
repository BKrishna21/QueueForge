const swaggerspec = {
    openapi: "3.0.0",
    info: {
        title: "QueueForge API",
        version: "1.0.0",
        description: "A distributed job processing platform built with Node.js, Express, PostgreSQL, and Redis."
    },
    servers: [
        { url: "https://queueforge-1qgr.onrender.com", description: "Production server" },
        { url: "http://localhost:5000", description: "Local development server" }
    ],
    paths: {

        "/jobs/createjob": {
            post: {
                summary: "Create a new job on a queue",
                tags: ["Jobs"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["queue", "type", "payload"],
                                properties: {
                                    queue: { type: "string", example: "email" },
                                    type: { type: "string", example: "email" },
                                    payload: { type: "object", example: { email: "test@test.com" } },
                                    priority: { type: "string", enum: ["high", "medium", "low"] },
                                    runat: { type: "string", format: "date-time" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: { description: "Job created successfully" }
                }
            }
        },

        "/jobs/{id}": {
            get: {
                summary: "Get full details of a job by id",
                tags: ["Jobs"],
                parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
                responses: {
                    200: { description: "Job found" },
                    404: { description: "Job not found" }
                }
            }
        },

        "/jobs/{id}/status": {
            get: {
                summary: "Get the current status of a job",
                tags: ["Jobs"],
                parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
                responses: {
                    200: { description: "Job status returned" },
                    404: { description: "Job not found" }
                }
            }
        },

        "/jobs/{id}/cancel": {
            patch: {
                summary: "Cancel a pending or running job",
                tags: ["Jobs"],
                parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
                responses: {
                    200: { description: "Job cancelled successfully" },
                    404: { description: "Job not found" }
                }
            }
        },

        "/queues": {
            get: {
                summary: "List all queues",
                tags: ["Queues"],
                responses: { 200: { description: "Queues returned" } }
            }
        },

        "/queues/{name}/pause": {
            patch: {
                summary: "Pause a queue",
                tags: ["Queues"],
                parameters: [{ in: "path", name: "name", required: true, schema: { type: "string" } }],
                responses: { 200: { description: "Queue paused" }, 404: { description: "Queue not found" } }
            }
        },

        "/queues/{name}/resume": {
            patch: {
                summary: "Resume a queue",
                tags: ["Queues"],
                parameters: [{ in: "path", name: "name", required: true, schema: { type: "string" } }],
                responses: { 200: { description: "Queue resumed" }, 404: { description: "Queue not found" } }
            }
        },

        "/queues/{name}/config": {
            patch: {
                summary: "Update a queue's configuration",
                tags: ["Queues"],
                parameters: [{ in: "path", name: "name", required: true, schema: { type: "string" } }],
                requestBody: {
                    required: true,
                    content: { "application/json": { schema: { type: "object" } } }
                },
                responses: { 200: { description: "Queue configuration updated" }, 404: { description: "Queue not found" } }
            }
        },

        "/queues/dashboard": {
            get: {
                summary: "Get dashboard stats for all queues",
                tags: ["Queues"],
                responses: { 200: { description: "Dashboard data returned" } }
            }
        },

        "/queues/dashboard/{name}": {
            get: {
                summary: "Get details for a single queue",
                tags: ["Queues"],
                parameters: [{ in: "path", name: "name", required: true, schema: { type: "string" } }],
                responses: { 200: { description: "Queue details returned" }, 404: { description: "Queue not found" } }
            }
        },

        "/queues/dashboard/{name}/jobs": {
            get: {
                summary: "Get all jobs belonging to a queue",
                tags: ["Queues"],
                parameters: [{ in: "path", name: "name", required: true, schema: { type: "string" } }],
                responses: { 200: { description: "Jobs returned" }, 404: { description: "Queue not found" } }
            }
        },

        "/dlq": {
            get: {
                summary: "List all dead-lettered jobs",
                tags: ["DLQ"],
                responses: { 200: { description: "Dead letter records returned" } }
            }
        },

        "/dlq/{id}": {
            get: {
                summary: "Get a single dead-letter record",
                tags: ["DLQ"],
                parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
                responses: { 200: { description: "Record found" }, 404: { description: "Record not found" } }
            },
            delete: {
                summary: "Delete a dead-letter record",
                tags: ["DLQ"],
                parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
                responses: { 200: { description: "Record deleted" } }
            }
        },

        "/dlq/{id}/replay": {
            post: {
                summary: "Replay a dead-lettered job",
                tags: ["DLQ"],
                parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
                responses: { 200: { description: "Job replayed successfully" }, 404: { description: "Record not found" } }
            }
        },

        "/dashboard/overview": {
            get: {
                summary: "Get worker and job overview stats",
                tags: ["Dashboard"],
                responses: { 200: { description: "Overview returned" } }
            }
        },

        "/dashboard/workers": {
            get: {
                summary: "List all workers",
                tags: ["Dashboard"],
                responses: { 200: { description: "Workers returned" } }
            }
        },

        "/dashboard/workers/{name}": {
            get: {
                summary: "Get details for a single worker",
                tags: ["Dashboard"],
                parameters: [{ in: "path", name: "name", required: true, schema: { type: "string" } }],
                responses: { 200: { description: "Worker found" }, 404: { description: "Worker not found" } }
            }
        }

    }
};

export default swaggerspec;