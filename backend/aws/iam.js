import { IAMClient, CreateUserCommand } from '@aws-sdk/client-iam';
import { createWindowsUser } from './ssm.js';
import { validatePassword } from '../validation/passwordValidation.js';
import dotenv from "dotenv";
dotenv.config()

// AWS IAM client setup
export const iamClient = new IAMClient({
    region: process.env.AWS_REGION, // Specify your region
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Your AWS access key
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY // Your AWS secret access key
    }
});

export async function createIAMUser(req, res)
{
    try 
    {
        // Get the email, username and password from the request body
        const { email, username, password } = req.body; 

        if (!email || !username || !password) 
        {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Validate password complexity
        if (!validatePassword(username, password)) 
        {
            return res.status(400).json(
            {
                message: "Password does not meet complexity requirements. It must be at least 8 characters long and include characters from at least three of the following categories: uppercase letters, lowercase letters, numbers, and special characters."
            });
        }
        // 1. Create IAM user using AWS SDK
        const createUserParams = { UserName: username };
        const iamCommand = new CreateUserCommand(createUserParams);
        const iamData = await iamClient.send(iamCommand);

        // 2. Create Windows user on EC2 using SSM (replace instanceId with actual EC2 instance ID)
        const instanceId = process.env.AWS_INSTANCE_ID;
        const commandId = await createWindowsUser(instanceId, username, password);

        // Respond with success
        return res.status(201).json({
            message: 'User created successfully',
            iamUser: iamData.User,
            ssmCommandId: commandId
        });
    } 
    catch (error) 
    {
        console.error('Error creating user:', error);
        return res.status(500).json({ message: 'Error creating user', error: error.message });
    }
}