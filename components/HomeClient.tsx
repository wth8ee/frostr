"use client";

import { useState } from "react";
import CreatePostForm from "./CreatePostForm";
import { Feed, PostWithAuthor } from "./Feed";
import { ScrollArea } from "./ui/scroll-area";
import CommentsSidebar from "./CommentsSidebar";
import { SidebarProvider } from "./ui/sidebar";

export function HomeClient({ posts }: { posts: PostWithAuthor[] }) {
  const [activePost, setActivePost] = useState<PostWithAuthor | null>(null);
  const [open, setOpen] = useState(false);

  const currentPostData =
    posts.find((post) => post.id === activePost?.id) || null;

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = (post: PostWithAuthor) => {
    setActivePost(post);
    setOpen(true);
  };

  return (
    <SidebarProvider
      open={!!open}
      style={{ "--sidebar-width": "420px" } as React.CSSProperties}
    >
      <div className="flex w-full h-screen overflow-hidden bg-transparent">
        <ScrollArea className="w-full h-screen">
          <div className="flex flex-1 flex-col gap-6 items-center p-4 pt-12 pb-24">
            <div className="text-center space-y-3 pb-2">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
                Welcome to Frostr
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
                Share your thoughts, connect with friends, and see what&apos;s
                happening right now in the cool world.
              </p>
            </div>

            <CreatePostForm />

            <Feed onOpenComments={handleOpen} posts={posts} />
          </div>
        </ScrollArea>

        <CommentsSidebar post={currentPostData} onClose={handleClose} />
      </div>
    </SidebarProvider>
  );
}
