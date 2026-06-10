"use client";

import { createComment } from "@/lib/actions";
import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { PostComment } from "./CommentsSidebar";
import { Comment } from "@/generated/prisma/client";
import { authClient } from "@/lib/auth-client";

export function CreateCommentForm({
  postId,
  onCommentAdded,
  onCommentSubmitted,
}: {
  postId: string | undefined;
  onCommentAdded: (newComment: PostComment) => void;
  onCommentSubmitted: (tempId: string, serverComment: Comment) => void;
}) {
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: session } = authClient.useSession();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim() || isSubmitting || !postId) return;
    setIsSubmitting(true);

    const textToSend = commentText;
    setCommentText("");
    const tempId = crypto.randomUUID();
    onCommentAdded({
      id: tempId,
      content: textToSend,
      createdAt: new Date(),
      updatedAt: new Date(),
      postId: postId || "",
      userId: "temp-user-id",
      user: { username: session?.user.username || "you" },
      _count: { commentLikes: 0 },
      commentLikes: [],
    });
    try {
      const serverComment = await createComment(textToSend, postId);

      onCommentSubmitted(tempId, serverComment);
      setCommentText("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full flex gap-2 items-center">
      <Input
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Write a comment..."
        className="flex-1 bg-transparent border-solid rounded-md text-sm h-9 focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
        maxLength={200}
        required
        disabled={isSubmitting}
      />
      <Button
        type="submit"
        size="icon"
        disabled={isSubmitting || !commentText.trim()}
        className="h-9 w-9 shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
