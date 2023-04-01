import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const REGION = process.env.AWS_REGION;

const ddbClient = new DynamoDBClient({ region: REGION });

export default ddbClient;
