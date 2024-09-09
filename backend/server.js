import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import usersRoute from "./routes/users.js";

const app = express(); // assing express to app

// CORS middleware
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
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

app.use('/users',usersRoute)