import { Prisma, User as IUser } from "@prisma/client";
import prisma from "./prisma";
import bcrypt from "bcrypt";

export interface User extends Omit<IUser, "password"> {
  password?: string;
}

export async function createUser(data: Prisma.UserCreateInput) {
  const user = await prisma.user.create({
    data: {
      ...data,
      password: await hashPassword(data.password),
    },
  });

  return user;
}

export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (user && (await checkPassword(password, user.password))) {
    return user;
  } else {
    return null;
  }
}

async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

async function checkPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
