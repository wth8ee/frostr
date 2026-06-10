"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar } from "@/components/Avatar";
import { PostWithAuthor } from "./Feed";
import { Heart, MessageSquare } from "lucide-react";
import { useState } from "react";
import { toggleLike } from "@/lib/actions";
import Link from "next/link";

export default function PostCard({
  post,
  onOpenComments,
}: {
  post: PostWithAuthor;
  onOpenComments: (post: PostWithAuthor) => void;
}) {
  const [isLiked, setIsLiked] = useState(post.likes && post.likes.length > 0);
  const [likesCount, setLikesCount] = useState(post._count?.likes || 0);
  const [isPending, setIsPending] = useState(false);

  const commentsCount = post._count?.comments || 0;

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  async function handleLike() {
    if (!isPending) {
      setIsPending(true);
      setIsLiked((prev) => !prev);
      setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

      try {
        await toggleLike(post.id);
      } catch (err) {
        setIsLiked((prev) => !prev);
        setLikesCount((prev) => (isLiked ? prev + 1 : prev - 1));
        console.log(err);
      } finally {
        setIsPending(false);
      }
    }
  }

  return (
    <Card className="w-full max-w-250 bg-sidebar border border-solid shadow-sm transition-colors mx-auto">
      <CardHeader className="flex flex-row items-center gap-3 space-y-0 px-6">
        <Link href={`/user/${post.author?.username}`}>
          <Avatar
            className="aspect-square h-9 cursor-pointer bg-black rounded-[35%] overflow-hidden border border-solid border-black"
            seed={post.author?.username || "John Doe"}
          />
        </Link>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <Link
              href={`/user/${post.author?.username}`}
              className="text-sm font-semibold tracking-tight text-foreground leading-none"
            >
              @{post.author?.username}
            </Link>
          </div>
          <span className="text-[11px] text-muted-foreground mt-0.5">
            {formattedDate}
          </span>
        </div>
      </CardHeader>

      <CardContent className="px-6 text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed w-full wrap-break-word">
        {post.content}
      </CardContent>

      <CardFooter className="border-t px-6 pt-4 flex gap-6 text-muted-foreground">
        <button
          onClick={handleLike}
          disabled={isPending}
          className="hover:text-red-500 transition-colors flex items-center gap-2 group cursor-pointer"
        >
          <Heart
            className={`h-5 w-5 transition-transform group-hover:scale-110 group-hover:text-red-500 ${
              isLiked
                ? "fill-red-500 text-red-500 animate-heartBeat"
                : "text-muted-foreground"
            }`}
            strokeWidth={2}
          />
          <span
            className={`font-medium text-sm leading-none ${isLiked ? "text-red-500" : ""}`}
          >
            {likesCount}
          </span>
        </button>
        <button
          onClick={() => onOpenComments(post)}
          className="hover:text-primary transition-colors flex items-center gap-2 group cursor-pointer"
        >
          <MessageSquare
            className="h-5 w-5 transition-transform group-hover:scale-110 group-hover:text-primary text-muted-foreground"
            strokeWidth={2}
          />
          <span className="font-medium text-sm leading-none group-hover:text-primary">
            {commentsCount}
          </span>
        </button>
      </CardFooter>
    </Card>
  );
}
