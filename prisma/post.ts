import { LikeType, Post } from "@prisma/client";

export interface IPost extends Post {
  _count: {
    comments: number;
    likes?: number;
    dislikes?: number;
  };
  author: {
    id: string;
    username: string;
    photo: string | null;
  };
  userReaction?: LikeType;
  userIsFollowing?: boolean;
}
