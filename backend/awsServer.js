import express from 'express';
import { createIAMUser } from './aws/iam.js';
import 'dotenv/config';
import setHeaders from './config/headers.js';
import { executePowershellScript } from './aws/ssm.js';
// Create Express app
const app = express();

// Use express middleware to parse JSON bodies
app.use(express.json());

//app.use(cors(corsOptions)); // Enable CORS with the defined options
app.use(setHeaders);

// API route to handle user registration, create IAM user, and create EC2 Windows user
app.post('/api/register', async (req, res) => createIAMUser(req, res));
app.post('/api/run-ssm', async (req, res) => executePowershellScript(req, res));
// Start the server
const AWS_PORT = process.env.AWS_PORT || 3000;
const server = app.listen(AWS_PORT, () => 
{
    console.log(`Server is running on port ${AWS_PORT}`);
});