import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import usersRoute from "./routes/users.js";
import { validateLogin } from "./loginValidation.js";
import setHeaders from "./headers.js";

const app = express(); // assing express to app
app.use(setHeaders); // setting CORS headers

dotenv.config(); // configure environment

const PORT = process.env.PORT; // assign port value from .env file 
const MONGOURL = process.env.MONGO_URL; // assign mongo url value from .env file

// connect to the database
mongoose.connect(MONGOURL).then(() =>  
{
    console.log("Database is connected successfully.");
    app.listen(PORT, () => 
    {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => console.log(error));

//add login verification
app.post('/api/login', (req,res) => 
{
    validateLogin(req, res);
})

app.use('/users',usersRoute)
