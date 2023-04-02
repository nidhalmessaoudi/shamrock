import { NextApiRequest, NextApiResponse } from "next";
import createUser from "../../../libs/ddb/users/createUser";

export default async function signup(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.redirect("/signup");

  const email = req.body.email as string;
  const username = req.body.username as string;
  const password = req.body.password as string;

  const user = await createUser({ email, username, password });

  if (user) {
    return res.redirect("/");
  }
}
