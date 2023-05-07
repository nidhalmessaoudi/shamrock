import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { sessionOptions } from "@/../libs/auth/session";
import prisma from "@/../prisma/prisma";
import formidable from "formidable";
import AppError from "@/helpers/AppError";
import K from "@/K";
import escapeHTML from "@/helpers/escapeHTML";
import { Category } from "@prisma/client";
import { PassThrough } from "stream";
import s3Client from "@/../../libs/s3/s3Client";
import { Upload } from "@aws-sdk/lib-storage";

export const config = {
  api: {
    bodyParser: false,
  },
};

function uploadImagesToS3(file: formidable.File) {
  const pass = new PassThrough();

  const imageUpload = new Upload({
    client: s3Client,
    params: {
      Bucket: K.S3_IMAGES_BUCKET,
      Body: pass,
      Key: file.newFilename,
      ContentType: file.mimetype || undefined,
    },
  });

  imageUpload.done().then(() => {});

  return pass;
}

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
    } else {
      return res.status(500).json({
        status: "error",
        message: "Something went wrong.",
      });
    }
  }
},
sessionOptions);

async function createNewPost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userId = req.session.user?.id;

    if (!userId) {
      throw new AppError(
        "You need to be authenticated to access this route.",
        403,
        "fail"
      );
    }

    const form = formidable({
      maxFiles: K.IMAGE_MAX_LENGTH,
      maxFileSize: K.IMAGE_MAX_SIZE,
      // @ts-ignore
      fileWriteStreamHandler: uploadImagesToS3,
    });

    const post = await new Promise((res, rej) => {
      try {
        let text: string;
        let category: Category;
        const images: string[] = [];

        form.parse(req);

        form.on("field", (fieldName, fieldVal) => {
          if (fieldName === "text") {
            if (!fieldVal || typeof fieldVal !== "string" || !fieldVal.trim()) {
              throw new AppError("The post text cannot be empty.", 400, "fail");
            }

            if (fieldVal.length > K.POST_MAX_LENGTH) {
              throw new AppError(
                `The post cannot contain more than ${K.POST_MAX_LENGTH} character.`,
                400,
                "fail"
              );
            }

            text = escapeHTML(fieldVal);
          }

          if (fieldName === "category") {
            if (!fieldVal || !K.POST_CATEGORIES.includes(fieldVal)) {
              category = K.POST_CATEGORIES[0] as Category;
            } else {
              category = fieldVal as Category;
            }
          }
        });

        form.on("file", (_, file) => {
          images.push(`${K.S3_IMAGES_URL}/${file.newFilename}`);
        });

        form.once("end", () => {
          prisma.post
            .create({
              data: { text, category, authorId: userId, images },
            })
            .then((post) => res(post));
        });

        form.on("error", (err) => {
          throw err;
        });
      } catch (err) {
        rej(err);
      }
    });

    return res.status(201).json({
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
  try {
    const posts = await prisma.post.findMany({
      include: { author: true, likes: true },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      status: "success",
      data: {
        posts,
      },
    });
  } catch (err) {
    throw err;
  }
}
