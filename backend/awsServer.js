// Import required modules
import express from 'express';
import cors from 'cors';
import { IAMClient, CreateUserCommand } from '@aws-sdk/client-iam';
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

// API route to handle user registration and create IAM user
app.post('/api/register', async (req, res) => {
    const { username } = req.body; // Get the username from the request body

    if (!username) {
        return res.status(400).json({ message: "Username is required" });
    }

    try {
        // Create an IAM user using the AWS SDK
        const createUserParams = { UserName: username };
        const command = new CreateUserCommand(createUserParams);
        const data = await iamClient.send(command);

        // Respond with success
        return res.status(201).json({ message: 'User created successfully', user: data.User });
    } catch (error) {
        // Handle errors
        console.error("Error creating IAM user:", error);
        return res.status(500).json({ message: "Error creating IAM user", error: error.message });
    }
});

// Start the server
const AWS_PORT = process.env.AWS_PORT;
app.listen(AWS_PORT, () => {
    console.log(`Server is running on port ${AWS_PORT}`);
});
