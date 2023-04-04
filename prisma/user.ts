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

export async function findUser(email: string, password: string) {
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
