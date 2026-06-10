"use client";

import { Heart } from "lucide-react";
import { Avatar } from "./Avatar";
import { useState } from "react";
import { PostComment } from "./CommentsSidebar";
import { toggleCommentLike } from "@/lib/actions";
import Link from "next/link";

export function CommentCard({ comment }: { comment: PostComment }) {
  const [isPending, setIsPending] = useState(false);
  const [isLiked, setIsLiked] = useState(
    comment.commentLikes && comment.commentLikes.length > 0,
  );
  const [likesCount, setLikesCount] = useState(
    comment._count.commentLikes || 0,
  );

  async function handleLike() {
    if (isPending) return;

    setIsPending(true);
    setLikesCount((prev: number) => (isLiked ? prev - 1 : prev + 1));
    setIsLiked((prev: boolean) => !prev);
    try {
      await toggleCommentLike(comment.id);
    } catch (err) {
      setLikesCount((prev: number) => (isLiked ? prev + 1 : prev - 1));
      setIsLiked((prev: boolean) => !prev);
      console.log(err);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div
      key={comment.id}
      className="flex justify-between items-center gap-2 py-4 px-6 border-b last:border-0"
    >
      <div className="flex gap-3 items-start">
        <Link href={`/user/${comment.user?.username}`}>
          <Avatar
            className="aspect-square h-8 bg-black rounded-[35%] overflow-hidden border border-solid border-black shrink-0"
            seed={comment.user?.username || "Anonymous"}
          />
        </Link>
        <div className="flex flex-col gap-0.5 max-w-[85%]">
          <Link
            href={`/user/${comment.user?.username}`}
            className="text-xs font-semibold text-foreground"
          >
            @{comment.user?.username}
          </Link>
          <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed wrap-break-word">
            {comment.content}
          </p>
        </div>
      </div>
      <div>
        <button
          onClick={handleLike}
          disabled={isPending}
          className="hover:text-red-500 transition-colors flex items-center gap-2 group group/like cursor-pointer"
        >
          <Heart
            className={`h-5 w-5 transition-all group-hover/like:scale-110 group-hover/like:text-red-500 ${
              isLiked
                ? "fill-red-500 text-red-500 animate-heartBeat"
                : "text-muted-foreground"
            }`}
            strokeWidth={2}
          />
          <span
            className={`font-medium text-sm leading-none transition-all ${isLiked ? "text-red-500" : ""}`}
          >
            {likesCount}
          </span>
        </button>
      </div>
    </div>
  );
}
