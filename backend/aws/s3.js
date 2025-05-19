import { PutObjectCommand } from '@aws-sdk/client-s3';
import 
{
    paginateListBuckets,
    S3Client,
    S3ServiceException,
} from "@aws-sdk/client-s3";
const region = import.meta.env.VITE_AWS_REGION;
const accessKeyId = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
const secretAccessKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY; 

const uploadObj = async ( bucketName, key, fileContent ) => 
{
    const client = new S3Client({
        region: region,
        credentials: {
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey
        }
    });
    try
    {
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: fileContent,
        });
        console.log("command:", command);
        const response = await client.send(command);
        console.log(response);
    } 
    catch (err)
    {
        console.error(err);
    }
}
export default uploadObj    