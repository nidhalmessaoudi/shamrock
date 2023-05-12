import { NextApiRequest, NextApiResponse } from "next";
import { authenticateUser } from "@/../prisma/user";
import { withIronSessionApiRoute } from "iron-session/next";
import { createUserSession, sessionOptions } from "@/../libs/auth/session";
import { verify } from "./users";
import { User } from "@prisma/client";

export default withIronSessionApiRoute(async function signin(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST") return res.redirect("/signin");

    req.body.type = "signin";

    const user = (await verify(req, res, true)) as User;

    if (user) {
      await createUserSession(req, user);

      return res.redirect("/");
    } else {
      return res.redirect("/signin");
    }
  } catch (err) {
    return res.redirect("/signin");
  }
},
sessionOptions);
