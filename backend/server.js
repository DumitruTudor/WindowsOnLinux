import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import usersRoute from "./routes/users.js";
import { validateLogin } from "./loginValidation.js";
import setHeaders from "./config/headers.js";
import { verifyEmail } from "./emailVerification.js";


const app = express(); // assing express to app
app.use(express.json());
app.use(setHeaders); // setting CORS headers
dotenv.config(); // configure environment

const PORT = process.env.PORT; // assign port value from .env file 
const MONGOURL = process.env.MONGO_URL; // assign mongo url value from .env file

// connect to the database
mongoose.connect(MONGOURL).then(() =>  
{
    console.log("Database is connected successfully.");
    const server = app.listen(PORT, () => 
    {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => console.log(error));

// add login verification
app.post('/api/login', async (req,res) => validateLogin(req,res));

// verify mail api
app.post('/api/verify-email', async (req,res) => verifyEmail(req,res));

// router for user actions
app.use('/users',usersRoute);
