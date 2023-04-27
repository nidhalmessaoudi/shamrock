import { Prisma } from "@prisma/client";

export type ILike = Prisma.LikeGetPayload<{
  include: { user: true; post: true };
}>;
