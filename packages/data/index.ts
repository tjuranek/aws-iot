import { IoTSiteWiseClient, BatchPutAssetPropertyValueCommand } from "@aws-sdk/client-iotsitewise";
import { v4 as uuid} from 'uuid';
import * as dotenv from 'dotenv';

dotenv.config();

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;

if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
    throw new Error('Environment file not set up correctly.');
}

const client = new IoTSiteWiseClient({
    region: "us-east-1",
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
    }
});

let level = 100;
async function tick() {
    const command = new BatchPutAssetPropertyValueCommand({
        entries: [
            {
                // assetId: "46a93035-4ab7-490e-a8a0-8d04be04f602",
                // propertyId: "8f523fe5-c5cd-40c2-bb0d-e9595f756342",
                propertyAlias: "/printster/printer/1/ink-level",
                entryId: uuid(),
                propertyValues: [
                    {
                        value: {
                            doubleValue:  level
                        },
                        timestamp: {
                            timeInSeconds: new Date().getTime() / 1000 
                        },
                        quality: 'GOOD'
                    }
                ],
            }
        ]
    });

    level--;
    if (level < 0) {
        level = 100;
    }

    await client.send(command);
}

setInterval(tick, 1000);
