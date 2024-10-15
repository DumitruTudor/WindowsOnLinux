// Import required modules
import express from 'express';
import cors from 'cors';
import { createIAMUser } from './aws/iam.js';
import 'dotenv/config';
import bodyParser from 'body-parser';

// Create Express app
const app = express();

// Use body-parser middleware to parse JSON bodies
app.use(bodyParser.json());

// CORS configuration to allow requests from the exact frontend origin
const corsOptions = {
    origin: 'http://localhost:5173', // Allow only this origin
    methods: 'GET,POST,PUT,DELETE,OPTIONS', // Allowed methods
    allowedHeaders: 'Content-Type,Authorization', // Allowed headers
    optionsSuccessStatus: 200 // For preflight requests
};

app.use(cors(corsOptions)); // Enable CORS with the defined options

// Password complexity validation function (Windows 10 rules)
const validatePassword = (password) => {
    const lengthRequirement = /.{8,}/;
    const uppercaseRequirement = /[A-Z]/;
    const lowercaseRequirement = /[a-z]/;
    const numberRequirement = /\d/;
    const specialCharRequirement = /[!@#$%^&*(),.?":{}|<>]/;

    // Check if password meets at least 3 out of 4 categories
    const validCategories = [
        uppercaseRequirement.test(password),
        lowercaseRequirement.test(password),
        numberRequirement.test(password),
        specialCharRequirement.test(password),
    ].filter(Boolean).length;

    return lengthRequirement.test(password) && validCategories >= 3;
};

// API route to handle user registration, create IAM user, and create EC2 Windows user
app.post('/api/register', async (req, res) => 
{
    // Get the username and password from the request body
    const { username, password } = req.body; 

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // Validate password complexity
    if (!validatePassword(password)) 
    {
        return res.status(400).json({
            message: "Password does not meet complexity requirements. It must be at least 8 characters long and include characters from at least three of the following categories: uppercase letters, lowercase letters, numbers, and special characters."
        });
    }

    
    //iam.js
    createIAMUser(username, password, res);
});

// Start the server
const AWS_PORT = process.env.AWS_PORT || 3000;
app.listen(AWS_PORT, () => 
{
    console.log(`Server is running on port ${AWS_PORT}`);
});
