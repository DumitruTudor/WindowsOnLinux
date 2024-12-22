import { S3Client } from '@aws-sdk/client-s3';
import * as fs from 'fs';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import 
{
    paginateListBuckets,
    S3Client,
    S3ServiceException,
} from "@aws-sdk/client-s3";
export const uploadObj = async ({ bucketName, key, filePath }) => 
{
    const client = new S3Client({});
    try
    {
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: fs.createReadStream(filePath),
        });

        const response = await client.send(command);
        console.log(response);
    } 
    catch (err)
    {
        console.error(err);
    }
}
    