import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import usersModel from '../models/usersModel.js';        
import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config()

export const sendVerificationEmail = async (email, userData) => 
{
    try
    {
        const token = jwt.sign({id: userData._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        const url = `http://localhost:5050/api/verify-email?token=${token}`
        const transporter = nodemailer.createTransport(
        {
            service: "Gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: 
            {
                user: process.env.EMAIL,
                pass: process.env.PASS,
            },  
        });
        const mailOptions = 
        {
            from: process.env.EMAIL,
            to: email,
            subject: 'Email Verification',
            text: `Click this link to verify your email: ${url}`
        };
        console.log("I got here");
        transporter.sendMail(mailOptions, (error, info) =>
        {
            if (error)
            {
                return console.log(error);
            }
            console.log('Verification email sent:', info.response);
        });
    }
    catch (error)
    {
        console.error('Error sending verification email:', error);
    }

};

export async function verifyEmail(req, res)
{
    const { token } = req.query;
    try 
    {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await usersModel.findById(decoded.id);
        if(!user)
            return res.redirect('http://localhost:5173/verify-fail');
        // Mark the user as verified
        user.verified = true;
        await user.save();
        return res.redirect('http://localhost:5173/verify-success');
    } 
    catch (error) 
    {
        res.redirect('http://localhost:5173/verify-fail');
        return console.error('Error verifying:', error);
    }
} 