import { Prisma } from "@prisma/client";

export type IPost = Prisma.PostGetPayload<{
  include: {
    author: true;
    likes: true;
    comments: true;
    _count: { select: { comments: true } };
  };
}>;
