import { Prisma } from "@prisma/client";

export type IComment = Prisma.CommentGetPayload<{
  include: { author: { select: { id: true; username: true; photo: true } } };
}>;
