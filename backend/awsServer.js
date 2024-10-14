// Import required modules
import express from 'express';
import cors from 'cors';
import { IAMClient, CreateUserCommand } from '@aws-sdk/client-iam';
import { SSMClient, SendCommandCommand } from '@aws-sdk/client-ssm'; // Import SSM client
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

// AWS IAM client setup
const iamClient = new IAMClient({
    region: process.env.AWS_REGION, // Specify your region
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Your AWS access key
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY // Your AWS secret access key
    }
});

// AWS SSM client setup
const ssmClient = new SSMClient({
    region: process.env.AWS_REGION, // Specify your region
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Your AWS access key
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY // Your AWS secret access key
    }
});

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

// Helper function to create a Windows user on an EC2 instance using SSM
const createWindowsUser = async (instanceId, username, password) => {
    try {
        const params = {
            DocumentName: 'AWS-RunPowerShellScript', // SSM document to run PowerShell
            InstanceIds: [instanceId], // Specify your EC2 instance ID here
            Parameters: {
                commands: [
                    `net user ${username} ${password} /ADD /Y`,
                    `net localgroup administrators ${username} /ADD /Y`
                ]
            }
        };

        // Send the SSM command
        const command = new SendCommandCommand(params);
        const data = await ssmClient.send(command);

        console.log('SSM Command sent:', data.Command.CommandId);
        return data.Command.CommandId; // Return Command ID for tracking
    } catch (error) {
        console.error('Error sending SSM command:', error);
        throw error;
    }
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

    try {
        // 1. Create IAM user using AWS SDK
        const createUserParams = { UserName: username };
        const iamCommand = new CreateUserCommand(createUserParams);
        const iamData = await iamClient.send(iamCommand);

        // 2. Create Windows user on EC2 using SSM (replace instanceId with actual EC2 instance ID)
        const instanceId = 'i-093293d6cf84c8052'; // Replace with your EC2 instance ID
        const commandId = await createWindowsUser(instanceId, username, password);

        // Respond with success
        return res.status(201).json({
            message: 'User created successfully',
            iamUser: iamData.User,
            ssmCommandId: commandId
        });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ message: 'Error creating user', error: error.message });
    }
});

// Start the server
const AWS_PORT = process.env.AWS_PORT || 3000;
app.listen(AWS_PORT, () => 
{
    console.log(`Server is running on port ${AWS_PORT}`);
});
