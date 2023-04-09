import { NextApiRequest, NextApiResponse } from "next";
import { findUser } from "../../../prisma/user";
import { withIronSessionApiRoute } from "iron-session/next";
import { createUserSession, sessionOptions } from "../../../libs/auth/session";

export default withIronSessionApiRoute(async function signout(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.end("Invalid Request!");

  req.session.destroy();
  res.redirect("/signin");
},
sessionOptions);
