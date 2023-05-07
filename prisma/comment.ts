import { Prisma } from "@prisma/client";

export type IComment = Prisma.CommentGetPayload<{
  include: { author: true };
}>;
