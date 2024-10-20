import express from "express";
import usersModel from "../models/usersModel.js";
import {sendVerificationEmail} from '../emailVerification.js'

const router = express.Router();

router.use(express.json());


// get operation which displays all users in database
router.get("/get", async(req, res) =>
{
    try 
    {
        const users = await usersModel.find();
        res.status(200).json(users);
    } 
    catch (error) 
    {
        console.log(error.message);
        res.status(500).json({message: error.message});
    }
});

// post operation used to create users
router.post("/createUser", async(req, res) =>
{
    let userData = req.body
    
    if(!userData.username || !userData.email || !userData.password)
        return res.status(400).json({message: "All fields are required."});
    try
    {
        userData = await usersModel.create(req.body);
        await sendVerificationEmail(userData.email, userData)
        res.status(200).json(userData);
    }
    catch(error)
    {
        console.log(error.message);
        res.status(500).json({message: error.message});
    }
});

// get by id operation, to retrieve users based on the id in the url
router.get('/get/:id', async(req, res) =>
{
    try
    {
        const user = await usersModel.findById(req.params.id);
        res.status(200).json(user);
    }
    catch (error)
    {
        console.log(error.message);
        res.status(500).json({message: error.message});
    }
});

//get user by email
router.get('/getByEmail/:email', async(req, res) =>
{
    try
    {
        const user = await usersModel.findOne({email: req.params.email});
        res.status(200).json(user);
    }
    catch (error)
    {
        console.log(error.message);
        res.status(500).json({message: error.message});
    }
});

// update a user based on the id in the url
router.patch('/update/:id', async(req, res) =>
{
    try
    {
        const updatedUser = await usersModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        // cannot find any user in database with the id in the url
        if(!updatedUser)
        {
            res.status(404).json({message: `Cannot find user with ID: ${req.params.id}`});
        }
        
        res.status(200).json(updatedUser);
    }
    catch (error)
    {
        console.log(error.message);
        res.status(500).json({message: error.message});
    }
});

// delete a user based on the id in the url
router.delete('/delete/:id', async(req, res) =>
{
    try
    {
        const user = await usersModel.findByIdAndDelete(req.params.id);
        // cannot find any user in database with the id in the url
        if(!user)
        {
            res.status(404).json({message: `Cannot find user with ID: ${req.params.id}`});
        }
        res.status(200).json(user);
    }
    catch (error)
    {
        console.log(error.message);
        res.status(500).json({message: error.message});
    }
});

export default router;

