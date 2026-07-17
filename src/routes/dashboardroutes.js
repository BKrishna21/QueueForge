import express from "express";

import {

    overview,
    workers,
    worker

} from "../controllers/dashboardcontroller.js";


const router = express.Router();


router.get(

    "/overview",

    overview

);


router.get(

    "/workers",

    workers

);


router.get(

    "/workers/:name",

    worker

);


export default router;