import prisma from "./prisma";
import bcrypt from "bcrypt";

interface User {
  email: string;
  username: string;
  password: string;
}

export async function createUser(data: User) {
  const user = await prisma.user.create({
    data: {
      ...data,
      password: await hashPassword(data.password),
    },
  });

  return user;
}

async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}
