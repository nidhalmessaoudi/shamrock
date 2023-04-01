import { PutItemCommand, PutItemCommandInput } from "@aws-sdk/client-dynamodb";
import ddbClient from "../ddbClient";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";

const TABLE_NAME = "users";

interface User {
  id?: string;
  username: string;
  email: string;
  password: string;
}

export default async function createUser(user: User) {
  try {
    const params: PutItemCommandInput = {
      TableName: TABLE_NAME,
      Item: {
        id: { S: generateUID() },
        username: { S: user.username },
        email: { S: user.email },
        password: { S: await hashPassword(user.password) },
      },
    };

    const userData = await ddbClient.send(new PutItemCommand(params));
    console.log(userData);

    return userData;
  } catch (err) {
    console.error(err);
  }
}

function generateUID() {
  return uuid();
}

function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}
