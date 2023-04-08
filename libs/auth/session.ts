import { User } from "@prisma/client";
import { IronSessionOptions } from "iron-session";
import { NextApiRequest } from "next";

export interface UserSession {
  id: string;
  email: string;
  username: string;
}

export const sessionOptions: IronSessionOptions = {
  cookieName: "pikri-session",
  password: process.env.SESSION_SECRET!,
  ttl: 0,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export async function createUserSession(req: NextApiRequest, user: User) {
  req.session.user = {
    id: user.id,
    email: user.email,
    username: user.username,
  };

  return req.session.save();
}

declare module "iron-session" {
  interface IronSessionData {
    user?: UserSession;
  }
}
