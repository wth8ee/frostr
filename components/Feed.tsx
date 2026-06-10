import { Prisma } from "@prisma/client";
import PostCard from "./PostCard";
export type PostWithAuthor = Prisma.PostGetPayload<{
  include: {
    author: {
      select: {
        username: true;
      };
    };
    _count: {
      select: {
        likes: true;
        comments: true;
      };
    };
    likes: {
      select: {
        id: true;
      };
    };
  };
}>;

interface FeedProps {
  posts: PostWithAuthor[];
  onOpenComments: (post: PostWithAuthor) => void;
}

export function Feed({ posts, onOpenComments }: FeedProps) {
  return (
    <div className="flex flex-col gap-6 w-full">
      {posts.map((post) => (
        <PostCard onOpenComments={onOpenComments} post={post} key={post.id} />
      ))}
    </div>
  );
}
