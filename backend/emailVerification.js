import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import User from './routes/users.js';    
import dotenv from 'dotenv';
dotenv.config()

export const sendVerificationEmail = async (email, userData) => 
{
    try
    {
        const token = jwt.sign({id: userData._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        const url = `http://localhost:8080/api/verify-email?token=${token}`
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
        const user = await User.findById(decoded.id);
        if(!user)
            return res.redirect('/verify-fail');
        // Mark the user as verified
        user.verified = true;
        await user.save();
        res.redirect('/verify-success');
        return res.status(200).json({ message: 'Email verified successfully' });    
    } 
    catch (error) 
    {
        res.redirect('/verify-fail');
        return res.status(500).json({ message: 'Invalid or expired token' });
    }
} 