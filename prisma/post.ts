import { Prisma } from "@prisma/client";

export type IPost = Prisma.PostGetPayload<{
  include: { author: true };
}>;
