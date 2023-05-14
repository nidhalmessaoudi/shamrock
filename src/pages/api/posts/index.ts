import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { sessionOptions } from "@/../libs/auth/session";
import prisma from "@/../prisma/prisma";
import formidable from "formidable";
import AppError from "@/helpers/AppError";
import K from "@/K";
import escapeHTML from "@/helpers/escapeHTML";
import { Category, Prisma } from "@prisma/client";
import { PassThrough } from "stream";
import s3Client from "@/../../libs/s3/s3Client";
import { Upload } from "@aws-sdk/lib-storage";
import { ObjectId } from "bson";
import { IPost } from "@/../prisma/post";

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
      filter: function ({ name, originalFilename, mimetype }) {
        return mimetype !== null && mimetype.includes("image");
      },
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
    const userId = req.session.user?.id;

    if (!userId) {
      throw new AppError(
        "You need to be authenticated to access this route.",
        403,
        "fail"
      );
    }

    let ctg = req.query.ctg as string | undefined;
    let sort = req.query.sort as string;
    let cursor = req.query.cursor as string | undefined;

    if (
      typeof ctg !== "string" ||
      !K.POST_CATEGORIES.includes(ctg) ||
      ctg === "All"
    ) {
      ctg = undefined;
    }

    if (typeof sort !== "string" || !K.POST_SORT_OPTIONS.includes(sort)) {
      sort = "Recent";
    }

    if (typeof cursor !== "string" || !ObjectId.isValid(cursor)) {
      cursor = undefined;
    }

    const postsOrderBy: Prisma.PostOrderByWithRelationInput = {};

    if (sort !== "Top Rated") {
      postsOrderBy.createdAt = "desc";
    }

    let posts: IPost[] = await prisma.post.findMany({
      take: 50,
      cursor: cursor ? { id: cursor } : undefined,
      where: {
        category: ctg as Category | undefined,
      },
      include: {
        author: { select: { id: true, username: true, photo: true } },
        _count: { select: { comments: true } },
      },
      orderBy: postsOrderBy,
    });

    let prodPosts: IPost[] = await Promise.all(
      posts.map(async (post) => {
        const prodPost = post;

        prodPost._count.likes = await prisma.like.count({
          where: { postId: post.id, type: "LIKE" },
        });
        prodPost._count.dislikes = await prisma.like.count({
          where: { postId: post.id, type: "DISLIKE" },
        });

        const like = await prisma.like.findUnique({
          where: { likeIdentifier: { userId, postId: post.id } },
        });

        if (like) {
          prodPost.userReaction = like.type;
        }

        if (post.authorId === userId) {
          prodPost.userIsFollowing = true;
        } else {
          const follow = await prisma.follow.findUnique({
            where: {
              followIdentifier: {
                followerId: userId,
                followedId: post.authorId,
              },
            },
          });

          if (follow) {
            prodPost.userIsFollowing = true;
          }
        }

        return prodPost;
      })
    );

    if (sort === "Following") {
      prodPosts = prodPosts.filter((post) => post.userIsFollowing);
    } else if (sort === "Top Rated") {
      prodPosts.sort(
        (post1, post2) => post2._count.likes! - post1._count.likes!
      );
    }

    return res.status(200).json({
      status: "success",
      data: {
        posts: prodPosts,
        cursor:
          prodPosts && prodPosts.length ? prodPosts[posts.length - 1].id : null,
      },
    });
  } catch (err) {
    throw err;
  }
}
