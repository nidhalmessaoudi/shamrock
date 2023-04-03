import { NextApiRequest, NextApiResponse } from "next";
import { createUser } from "../../../prisma/user";

export default async function signup(
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
      return res.redirect("/");
    }
  } catch (err) {
    console.log(err);
  }
}
