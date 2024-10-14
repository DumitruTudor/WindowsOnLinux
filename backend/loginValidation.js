import express from "express";
import mongoose from "mongoose";   
import User from "./routes/users";

const app = express();
app.use(express.json());

//Adding login route
export function loginValid()
{
    app.post('api/login',async(req,res)=>
    {
        const {email,password} = req.body;
        if (!email || !password)
        {
            res.status(400).json({message:"Please provide email and password"});
        }
        try
        {
            const user = await User.findOne({email, password});
            if(user)
            {
                res.status(200).json({message:"Login successful"});
            }
            else
            {
                res.status(401).json({message:"Invalid credentials"});
            }
        }
        catch(error)
        {
            console.error('Error checking user existence:', error);
            return res.status(500).json({ message: 'Server error', error: error.message });
        }
    },res);
}