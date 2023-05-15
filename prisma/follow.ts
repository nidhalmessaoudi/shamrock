import { Prisma } from "@prisma/client";

export type IFollow = Prisma.FollowGetPayload<{
  select: { followed: { select: { id: true; username: true; photo: true } } };
}>;
