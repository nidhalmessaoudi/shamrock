import { NextApiRequest, NextApiResponse } from "next";
import { createUser } from "../../../prisma/user";
import { withIronSessionApiRoute } from "iron-session/next";
import { createUserSession, sessionOptions } from "../../../libs/auth/session";

export default withIronSessionApiRoute(async function signup(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST") return res.redirect("/signup");

    const email = req.body.email as string;
    const username = req.body.username as string;
    const password = req.body.password as string;

    const user = await createUser({ email, username, password });

    console.log(user);

    if (user) {
      await createUserSession(req, user);

      return res.redirect("/");
    } else {
      return res.redirect("/signup");
    }
  } catch (err) {
    console.log(err);
  }
},
sessionOptions);
