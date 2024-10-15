import { SSMClient, SendCommandCommand } from '@aws-sdk/client-ssm';
import dotenv from 'dotenv';

dotenv.config()
// AWS SSM client setup
export const ssmClient = new SSMClient({
    region: process.env.AWS_REGION, // Specify your region
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Your AWS access key
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY // Your AWS secret access key
    }
});

// Helper function to create a Windows user on an EC2 instance using SSM
export const createWindowsUser = async (instanceId, username, password) => {
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