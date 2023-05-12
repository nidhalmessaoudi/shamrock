import AppError from "@/helpers/AppError";
import { NextApiRequest, NextApiResponse } from "next";
import { authenticateUser } from "../../../../prisma/user";
import isEmail from "validator/lib/isEmail";
import K from "@/K";
import prisma from "../../../../prisma/prisma";

export default async function users(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case "POST":
        await verify(req, res);
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
}

export async function verify(
  req: NextApiRequest,
  res: NextApiResponse,
  internallyCalled?: boolean
) {
  try {
    const types = ["signin", "signup"];
    const type = req.body.type as string;
    if (!type || typeof type !== "string" || !types.includes(type)) {
      throw new AppError(
        "You need to provide the verification type. (signin | signup)",
        400,
        "fail"
      );
    }

    const email = req.body.email as string;

    if (!email || typeof email !== "string" || !isEmail(email)) {
      throw new AppError(
        "You need to provide a valid email address.",
        401,
        "fail"
      );
    }

    const password = req.body.password as string;

    if (!password || typeof password !== "string") {
      throw new AppError("You need to provide a valid password.", 401, "fail");
    }

    if (password.length < 8) {
      throw new AppError(
        "The password must be at least 8 characters long.",
        401,
        "fail"
      );
    }

    if (type === "signin") {
      const user = await authenticateUser(email, password);

      if (!user) {
        throw new AppError("Incorrect email or password.", 401, "fail");
      }

      if (internallyCalled) {
        return user;
      } else {
        return res.status(200).json({
          status: "success",
          message: "This is an authentic registered user.",
        });
      }
    } else if (type === "signup") {
      const username = req.body.username as string;
      const usernameRegex = new RegExp(
        "^(?=.{4,20}$)(?![_])(?!.*__)[a-zA-Z0-9_]+(?<![_])$"
      );

      if (!username || typeof username !== "string") {
        throw new AppError(
          "You need to provide a valid username.",
          401,
          "fail"
        );
      }

      if (username.length < 4) {
        throw new AppError(
          "The username must be at least 4 characters long.",
          401,
          "fail"
        );
      }

      if (username.length > K.USERNAME_MAX_LENGTH) {
        throw new AppError(
          `The username cannot contain more than ${K.USERNAME_MAX_LENGTH} characters.`,
          401,
          "fail"
        );
      }

      if (username.startsWith("_") || username.endsWith("_")) {
        throw new AppError(
          "The username cannot start or end with an underscore.",
          401,
          "fail"
        );
      }

      if (username.includes("__")) {
        throw new AppError(
          "The username cannot contain consecutive underscores.",
          401,
          "fail"
        );
      }

      if (!usernameRegex.test(username)) {
        throw new AppError(
          "The username can only contain letters, numbers, and underscores.",
          401,
          "fail"
        );
      }

      let anotherUser = await prisma.user.findUnique({ where: { email } });

      if (anotherUser) {
        throw new AppError("This email is already used.", 401, "fail");
      }

      anotherUser = await prisma.user.findUnique({ where: { username } });

      if (anotherUser) {
        throw new AppError("This username is already used.", 401, "fail");
      }

      if (internallyCalled) {
        return "SAFE";
      } else {
        return res.status(200).json({
          status: "200",
          message: "All provided credentials are safe.",
        });
      }
    }
  } catch (err) {
    throw err;
  }
}
