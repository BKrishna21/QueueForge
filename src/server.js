
import dotenv from "dotenv";
import approuter from "./app.js";

dotenv.config();
const port=process.env.PORT || 5000;

approuter.listen(port, ()=>{
    console.log(`Server is listening at port: ${port}`);
});