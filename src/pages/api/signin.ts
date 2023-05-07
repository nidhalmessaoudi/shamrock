import { NextApiRequest, NextApiResponse } from "next";
import { authenticateUser } from "@/../prisma/user";
import { withIronSessionApiRoute } from "iron-session/next";
import { createUserSession, sessionOptions } from "@/../libs/auth/session";

export default withIronSessionApiRoute(async function signin(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST") return res.redirect("/signin");

    const email = req.body.email as string;
    const password = req.body.password as string;

    if (!email && !password) {
      return res.redirect("/signin");
    }

    const user = await authenticateUser(email, password);

    console.log(user);

    if (user) {
      await createUserSession(req, user);

      return res.redirect("/");
    } else {
      return res.redirect("/signin");
    }
  } catch (err) {
    console.log(err);
  }
},
sessionOptions);
