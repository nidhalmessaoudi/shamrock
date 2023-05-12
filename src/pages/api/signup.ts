import { NextApiRequest, NextApiResponse } from "next";
import { createUser } from "@/../prisma/user";
import { withIronSessionApiRoute } from "iron-session/next";
import { createUserSession, sessionOptions } from "@/../libs/auth/session";
import { verify } from "./users";

export default withIronSessionApiRoute(async function signup(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST") return res.redirect("/signup");

    req.body.type = "signup";

    const safe = (await verify(req, res, true)) as string;

    if (safe === "SAFE") {
      const user = await createUser({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
      });

      if (user) {
        await createUserSession(req, user);

        return res.redirect("/");
      } else {
        return res.redirect("/signup");
      }
    }
  } catch (err) {
    return res.redirect("/signup");
  }
},
sessionOptions);
