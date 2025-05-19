import userModel from "../models/usersModel.js";     
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

//Adding login route
export async function validateLogin(req,res)
{
    const {email,password} = req.body;
    console.log(email + " " + password)
    if (!email || !password)
    {
        return res.status(400).json({message:"Please provide email and password"});
    }
    try
    {
        let user = await userModel.findOne( { email } );
        console.log(user)
        if(!user)
        {
            return res.status(200).json({message:"Invalid Credentials"});
        }
        else
        {
            const isMatch = await bcrypt.compare(password, user.password);
            console.log(isMatch)
            if(!isMatch)
            {
                return res.status(200).json({message:"Invalid Password"});
            }
            if(!user.verified)
            {
                return res.status(403).json({message:"Please verify your email"});
            }
            // if all checks pass, generate a JWT token 
            const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
            
            return res.status(200).json({token, user: {username: user.username, email: user.email}, message: "Login successful"});
        }
    }
    catch(error)
    {
        console.error('Error logging in:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}
