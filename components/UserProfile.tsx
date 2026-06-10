"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageSquare,
  UserPlus,
  Grid,
  Heart,
  UserCheck,
  Pencil,
} from "lucide-react";
import { Avatar } from "@/components/Avatar";
import PostCard from "./PostCard";
import { PostWithAuthor } from "./Feed";
import { Prisma } from "@prisma/client";
import { useAuth } from "@/context/AuthContext";
import React, { useState } from "react";
import { toggleFollow } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { SidebarProvider } from "./ui/sidebar";
import CommentsSidebar from "./CommentsSidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "./ui/dropdown-menu";

export type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    followers: true;
    following: true;
  };
}>;

interface UserProfileProps {
  initialIsFollowing: boolean;
  user: UserWithRelations;
  userPosts: PostWithAuthor[];
  likedPosts: PostWithAuthor[];
  currentUser: UserWithRelations;
}

export function UserProfile({
  user,
  initialIsFollowing,
  userPosts = [],
  likedPosts = [],
  currentUser,
}: UserProfileProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isPending, setIsPending] = useState(false);
  const [followers, setFollowers] = useState(user.followers);
  const Router = useRouter();
  const [activePost, setActivePost] = useState<PostWithAuthor | null>(null);
  const [open, setOpen] = useState(false);

  const isOwnPage =
    currentUser?.username && currentUser.username === user.username;

  function handleFollow() {
    if (!currentUser) {
      Router.push("/sign-in");
    } else {
      try {
        setIsPending(true);
        toggleFollow(currentUser.username, user.username);
        setFollowers((prev) =>
          prev.some((follower) => follower.id === currentUser.id)
            ? prev.filter((follower) => follower.id !== currentUser.id)
            : [...prev, currentUser],
        );
        setIsFollowing((prev) => !prev);
      } catch (err) {
        console.error(err);
        setIsFollowing((prev) => !prev);
        setFollowers((prev) =>
          prev.some((follower) => follower.id === currentUser.id)
            ? prev.filter((follower) => follower.id !== currentUser.id)
            : [...prev, currentUser],
        );
      } finally {
        setIsPending(false);
      }
    }
  }

  const allPosts = [...userPosts, ...likedPosts];

  const currentPostData =
    allPosts.find((post) => post.id === activePost?.id) || null;

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
            <Card className="w-full max-w-250 bg-sidebar border border-solid shadow-sm mx-auto overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
                  <Avatar
                    className="aspect-square h-24 w-24 bg-black rounded-[35%] overflow-hidden border border-solid border-black shrink-0"
                    seed={user.username || "Anonymous"}
                  />

                  <div className="flex-1 space-y-4 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">
                          @{user.username}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap leading-relaxed">
                          {user.bio || "This user hasn't added a bio yet."}
                        </p>
                      </div>

                      <div className="flex items-center justify-center gap-2 shrink-0">
                        {isOwnPage ? (
                          <Link
                            href={`/user/${currentUser.username}/edit`}
                            className="w-full sm:w-auto"
                          >
                            <Button
                              variant="outline"
                              className="font-semibold min-w-30 flex justify-center rounded-xl px-4 border-solid text-sm gap-2"
                            >
                              <Pencil className="h-4 w-4 text-muted-foreground" />
                              Edit Profile
                            </Button>
                          </Link>
                        ) : (
                          <>
                            {isFollowing ? (
                              <Button
                                disabled={isPending}
                                onClick={handleFollow}
                                className="font-semibold min-w-35 flex transition-none justify-center rounded-xl px-4 bg-transparent text-foreground border border-solid border-border/80 hover:bg-muted"
                              >
                                <UserCheck className="h-4 w-4 mr-2" />
                                Following
                              </Button>
                            ) : (
                              <Button
                                disabled={isPending}
                                onClick={handleFollow}
                                className="font-semibold flex justify-center transition-none min-w-35 rounded-xl px-4 bg-primary text-primary-foreground hover:bg-primary/90"
                              >
                                <UserPlus className="h-4 w-4 mr-2" />
                                Follow
                              </Button>
                            )}

                            <Link href={`/messages/${user.username}`}>
                              <Button
                                variant="outline"
                                className="rounded-xl px-3 border-solid"
                              >
                                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </Link>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-center sm:justify-start gap-6 pt-2 border-t border-solid border-border/50 text-sm">
                      <div className="flex gap-1.5 items-center">
                        <span className="font-bold text-foreground">
                          {userPosts.length}
                        </span>
                        <span className="text-muted-foreground">posts</span>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <div className="flex gap-1.5 items-center cursor-pointer hover:underline outline-none select-none">
                            <span className="font-bold text-foreground">
                              {followers.length}
                            </span>
                            <span className="text-muted-foreground">
                              followers
                            </span>
                          </div>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                          align="start"
                          className="w-64 bg-sidebar border border-solid shadow-md rounded-xl p-1.5 max-h-64 overflow-y-auto"
                        >
                          <DropdownMenuLabel className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground/80 px-2.5 pt-1.5 pb-1">
                            Followers List
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator className="mb-1.5 mt-0.5 bg-border/40" />

                          {followers && followers.length > 0 ? (
                            followers.map((follower, index) => (
                              <React.Fragment key={follower.id}>
                                <DropdownMenuItem
                                  asChild
                                  className="w-full flex items-center gap-3 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-background focus:bg-background transition-colors outline-none"
                                >
                                  <Link href={`/user/${follower.username}`}>
                                    <Avatar
                                      className="aspect-square h-7 w-7 bg-black rounded-[35%] overflow-hidden border border-solid border-black shrink-0"
                                      seed={follower.username || "Anonymous"}
                                    />
                                    <span className="text-xs font-semibold tracking-tight text-foreground truncate">
                                      @{follower.username}
                                    </span>
                                  </Link>
                                </DropdownMenuItem>

                                {index < user.followers.length - 1 && (
                                  <DropdownMenuSeparator className="my-1 bg-border/40" />
                                )}
                              </React.Fragment>
                            ))
                          ) : (
                            <div className="text-center py-6 text-xs text-muted-foreground font-medium">
                              No followers yet
                            </div>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <div className="flex gap-1.5 items-center cursor-pointer hover:underline outline-none select-none">
                            <span className="font-bold text-foreground">
                              {user.following.length}
                            </span>
                            <span className="text-muted-foreground">
                              following
                            </span>
                          </div>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                          align="start"
                          className="w-64 bg-sidebar border border-solid shadow-md rounded-xl p-1.5 max-h-64 overflow-y-auto"
                        >
                          <DropdownMenuLabel className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground/80 px-2.5 pt-1.5 pb-1">
                            Following List
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator className="mb-1.5 mt-0.5 bg-border/40" />

                          {user.following && user.following.length > 0 ? (
                            user.following.map((followedUser, index) => (
                              <React.Fragment key={followedUser.id}>
                                <DropdownMenuItem
                                  asChild
                                  className="w-full flex items-center gap-3 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-background focus:bg-background transition-colors outline-none"
                                >
                                  <Link href={`/user/${followedUser.username}`}>
                                    <Avatar
                                      className="aspect-square h-7 w-7 bg-black rounded-[35%] overflow-hidden border border-solid border-black shrink-0"
                                      seed={
                                        followedUser.username || "Anonymous"
                                      }
                                    />
                                    <span className="text-xs font-semibold tracking-tight text-foreground truncate">
                                      @{followedUser.username}
                                    </span>
                                  </Link>
                                </DropdownMenuItem>

                                {index < user.following.length - 1 && (
                                  <DropdownMenuSeparator className="my-1 bg-border/40" />
                                )}
                              </React.Fragment>
                            ))
                          ) : (
                            <div className="text-center py-6 text-xs text-muted-foreground font-medium">
                              Not following anyone yet
                            </div>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="posts" className="w-full max-w-250 mx-auto">
              <TabsList className="flex justify-start bg-transparent p-0 h-auto rounded-none gap-3">
                <TabsTrigger
                  value="posts"
                  className="rounded-xl border border-solid border-border/60 bg-sidebar shadow-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary text-muted-foreground text-xs font-bold transition-all px-4 py-2.5"
                >
                  <Grid className="h-3.5 w-3.5 mr-1.5" />
                  Posts
                </TabsTrigger>
                <TabsTrigger
                  value="liked"
                  className="rounded-xl border border-solid border-border/60 bg-sidebar shadow-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary text-muted-foreground text-xs font-bold transition-all px-4 py-2.5"
                >
                  <Heart className="h-3.5 w-3.5 mr-1.5" />
                  Likes
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="posts"
                className="mt-6 space-y-6 outline-none"
              >
                {userPosts.length > 0 ? (
                  userPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onOpenComments={handleOpen}
                    />
                  ))
                ) : (
                  <Card className="w-full bg-sidebar border border-solid shadow-sm mx-auto text-center py-16 text-muted-foreground text-sm font-medium">
                    No publications yet
                  </Card>
                )}
              </TabsContent>

              <TabsContent
                value="liked"
                className="mt-6 space-y-6 outline-none"
              >
                {likedPosts.length > 0 ? (
                  likedPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onOpenComments={handleOpen}
                    />
                  ))
                ) : (
                  <Card className="w-full bg-sidebar border border-solid shadow-sm mx-auto text-center py-16 text-muted-foreground text-sm font-medium">
                    No liked posts yet
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>

        <CommentsSidebar post={currentPostData} onClose={handleClose} />
      </div>
    </SidebarProvider>
  );
}
