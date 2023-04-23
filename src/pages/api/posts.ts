import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { sessionOptions } from "../../../libs/auth/session";
import prisma from "../../../prisma/prisma";
import formidable from "formidable";
import AppError from "@/helpers/AppError";
import K from "@/K";
import escapeHTML from "@/helpers/escapeHTML";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default withIronSessionApiRoute(async function posts(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "POST":
        await createNewPost(req, res);
        break;
      case "GET":
        await getPosts(req, res);
        break;
      default:
        return res.redirect("/");
    }
  } catch (err) {
    console.error(err);

    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
  }
},
sessionOptions);

async function createNewPost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userId = req.session.user?.id;

    const form = formidable();

    form.parse(req, (err, data, files) => {
      let text = data.text as string;
      let category = data.category as string;

      if (!text || !text.trim()) {
        throw new AppError("The post text cannot be empty.", 400, "fail");
      }

      if (text.length > K.POST_MAX_LENGTH) {
        throw new AppError(
          `The post cannot contain more than ${K.POST_MAX_LENGTH} character.`,
          400,
          "fail"
        );
      }

      if (!category || !K.POST_CATEGORIES.includes(category)) {
        category = K.POST_CATEGORIES[0];
      }

      text = escapeHTML(text);
    });

    if (!userId) {
      throw new AppError(
        "You need to be authenticated to access this route.",
        403,
        "fail"
      );
    }

    console.log(req.body);

    const postText = req.body.text as string;

    if (!postText && !(typeof postText === "string")) {
      return res.status(400).json({
        status: "fail",
        message: "Some required post fields are missing.",
      });
    }

    const post = await prisma.post.create({
      data: { text: postText, authorId: userId },
    });

    return res.status(200).json({
      status: "success",
      data: {
        post,
      },
    });
  } catch (err) {
    throw err;
  }
}

async function getPosts(req: NextApiRequest, res: NextApiResponse) {
  const posts = await prisma.post.findMany({ include: { author: true } });

  return res.status(200).json({
    status: "success",
    data: {
      posts,
    },
  });
}
