import AppError from "@/helpers/AppError";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { sessionOptions } from "@/../libs/auth/session";
import prisma from "@/../prisma/prisma";

export default withIronSessionApiRoute(async function user(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "GET":
        await getOneUser(req, res);
        break;
      default:
        return res.redirect("/");
    }
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      return res.status(500).json({
        status: "error",
        message: "Something went wrong.",
      });
    }
  }
},
sessionOptions);

async function getOneUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    let { username } = req.query;

    if (!username || typeof username !== "string") {
      throw new Error();
    }

    username = username.replaceAll("$", "");

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        photo: true,
        _count: {
          select: { followers: true, followings: true },
        },
      },
    });

    if (!user) {
      throw new AppError(
        "This user is not found or doesn't exist anymore.",
        404,
        "error"
      );
    }

    return res.status(200).json({
      status: "success",
      data: { user },
    });
  } catch (err) {
    throw err;
  }
}
