import express from "express";

import {
    getalldeadjobs,
    getdeadjob,
    replaydeadjob,
    deletedeadjob
} from "../controllers/dlqcontroller.js";

const router = express.Router();

router.get(
    "/",
    getalldeadjobs
);

router.get(
    "/:id",
    getdeadjob
);

router.post(
    "/:id/replay",
    replaydeadjob
);

router.delete(
    "/:id",
    deletedeadjob
);

export default router;