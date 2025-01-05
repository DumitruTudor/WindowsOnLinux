import { EC2Client, DescribeInstancesCommand } from "@aws-sdk/client-ec2";

//const region = "eu-west-2";
//const accessKeyId = "AKIAU6GDVT2ORDAG7GUI";
//const secretAccessKey =  "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";
//const instanceId = "i-0e10a9ff30b301341";
const region = import.meta.env.VITE_AWS_REGION;
const accessKeyId = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
const secretAccessKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY; 
const instanceId = import.meta.env.VITE_AWS_INSTANCE_ID;
const getEC2IPv4Address = async () => {
    const ec2 = new EC2Client({
        region: region,
        credentials: {
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey
        }
    });
    try
    {
        const command = new DescribeInstancesCommand({
            InstanceIds: [instanceId]
        });
        const response = await ec2.send(command);
        const reservations = response.Reservations || [];
        if (reservations.length > 0) {
            const instances = reservations[0].Instances || [];
            if (instances.length > 0) {
                const publicIp = instances[0].PublicIpAddress; // Public IPv4
                return publicIp;
            }
        }
        console.log("No instances found with the specified ID.");
        return null;
    } catch (error) {
        console.error("Error fetching EC2 instance details:", error.message);
        throw error;
    }
};

export default getEC2IPv4Address;
