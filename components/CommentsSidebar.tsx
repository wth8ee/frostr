"use client";

import { PostWithAuthor } from "./Feed";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { CommentCard } from "./CommentCard";
import { CreateCommentForm } from "./CreateCommentForm";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { getComments } from "@/lib/actions";
import { Skeleton } from "./ui/skeleton";
import { Prisma, Comment } from "@prisma/client";

interface CommentsSidebarProps {
  post: PostWithAuthor | null;
  onClose: () => void;
}
export type PostComment = Prisma.CommentGetPayload<{
  include: {
    user: { select: { username: true } };
    _count: { select: { commentLikes: true } };
    commentLikes: {
      select: { id: true };
    };
  };
}>;

export default function CommentsSidebar({
  post,
  onClose,
}: CommentsSidebarProps) {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const postId = post?.id;
  const commentsCount = post?._count?.comments || 0;

  useEffect(() => {
    if (!postId) {
      return;
    }

    async function fetchComments() {
      if (postId) {
        setIsLoading(true);
        try {
          const fetchedComments: PostComment[] = await getComments(postId);
          await new Promise((resolve) => setTimeout(resolve, 200));

          setComments(fetchedComments);
        } catch (err) {
          console.log(err);
        } finally {
          setIsLoading(false);
        }
      }
    }

    fetchComments();
  }, [postId]);

  return (
    <Sidebar
      side="right"
      variant="sidebar"
      className="border-l bg-sidebar shadow-sm"
    >
      <SidebarHeader className="h-14 px-6 border-b flex flex-row items-center justify-between shrink-0 bg-sidebar">
        <h2 className="text-sm font-semibold tracking-tight text-foreground">
          Comments ({commentsCount})
        </h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-muted rounded-[25%] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-y-auto gap-0 bg-sidebar">
        {!isLoading &&
          comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        {isLoading &&
          [0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-3 items-start px-6 py-4">
              <Skeleton className="aspect-square h-8 rounded-[35%] shrink-0" />
              <div className="flex flex-col gap-2 max-w-[85%]">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-60" />
              </div>
            </div>
          ))}

        {!isLoading && comments.length === 0 && (
          <p className="text-center text-md text-muted-foreground pt-12">
            No comments yet. Say something cool!
          </p>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4 px-6 border-t bg-sidebar flex flex-row gap-2 items-center shrink-0 pb-6">
        <CreateCommentForm
          onCommentSubmitted={(tempId: string, serverComment: Comment) => {
            setComments((prev) =>
              prev?.map((c) =>
                c.id === tempId ? { ...c, id: serverComment.id } : c,
              ),
            );
          }}
          onCommentAdded={(newComment: PostComment) =>
            setComments((prev) => [...(prev || []), newComment])
          }
          postId={postId}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
