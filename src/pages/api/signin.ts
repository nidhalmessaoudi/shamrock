import { NextApiRequest, NextApiResponse } from "next";
import { findUser } from "../../../prisma/user";

export default async function signin(
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

    const user = await findUser(email, password);

    console.log(user);

    if (user) {
      return res.redirect("/");
    } else {
      return res.redirect("/signin");
    }
  } catch (err) {
    console.log(err);
  }
}
