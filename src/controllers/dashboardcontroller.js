import {

    getoverview,
    getworkers,
    getworker

} from "../services/dashboardservices.js";


export const overview = async (req, res) => {

    try {

        const data = await getoverview();

        return res.status(200).json({

            success: true,

            data

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


export const workers = async (req, res) => {

    try {

        const data = await getworkers();

        return res.status(200).json({

            success: true,

            data

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


export const worker = async (req, res) => {

    try {

        const data = await getworker(req.params.name);

        if (!data) {

            return res.status(404).json({

                success: false,

                message: "worker not found"

            });

        }

        return res.status(200).json({

            success: true,

            data

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};