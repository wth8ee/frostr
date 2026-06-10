"use server";

import { headers } from "next/headers";
import { auth } from "./auth";
import { prisma } from "./db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { User } from "@prisma/client";
import { disconnect } from "process";
import { UserWithRelations } from "@/components/UserProfile";

export async function createPost(content: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    redirect("/sign-in");
  }

  await prisma.post.create({
    data: {
      content: content,
      userId: session?.user.id,
    },
  });

  revalidatePath("/");
}

export async function toggleLike(postId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    redirect("/sign-in");
  }

  const userId = session.user.id;

  const existingLike = await prisma.like.findUnique({
    where: {
      userId_postId: {
        userId,
        postId,
      },
    },
  });

  if (existingLike) {
    await prisma.like.delete({
      where: {
        id: existingLike.id,
      },
    });
  } else {
    await prisma.like.create({
      data: {
        userId,
        postId,
      },
    });
  }

  revalidatePath("/");
}

export async function createComment(content: string, postId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    redirect("/sign-in");
  }

  const userId = session.user.id;

  const newComment = await prisma.comment.create({
    data: {
      content,
      userId,
      postId,
    },
  });

  revalidatePath("/");
  return newComment;
}

export async function getComments(postId: string) {
  if (!postId) return [];

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user.id;

  return await prisma.comment.findMany({
    where: { postId },
    include: {
      user: { select: { username: true } },
      _count: { select: { commentLikes: true } },
      commentLikes: userId
        ? {
            where: { userId: userId },
            select: { id: true },
          }
        : false,
    },
  });
}

export async function toggleCommentLike(commentId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    redirect("/sign-in");
  }

  const userId = session.user.id;

  const existingCommentLike = await prisma.commentLike.findUnique({
    where: {
      commentId_userId: {
        commentId,
        userId,
      },
    },
  });

  if (existingCommentLike) {
    await prisma.commentLike.delete({
      where: {
        id: existingCommentLike.id,
      },
    });
  } else {
    await prisma.commentLike.create({
      data: {
        commentId,
        userId,
      },
    });
  }
}

export async function getUserByUsername(username: string) {
  const user = await prisma.user.findUnique({
    where: { username: username },
    include: {
      followers: true,
      following: true,
    },
  });

  return user;
}

export async function getUserPostsWithCurrentUserLikes(
  username: string,
  currentUsername: string,
) {
  const user = await getUserByUsername(username);
  const currentUser = await getUserByUsername(currentUsername);

  if (!user) {
    return [];
  }

  const userPosts = await prisma.post.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: {
          username: true,
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
      likes: currentUser
        ? {
            where: { userId: currentUser.id },
            select: {
              id: true,
            },
          }
        : false,
    },
  });

  return userPosts;
}

export async function getLikedPostsWithCurrentUserLikes(
  username: string,
  currentUsername: string,
) {
  const user = await getUserByUsername(username);
  const currentUser = await getUserByUsername(currentUsername);

  if (!user) {
    return [];
  }

  const userPosts = await prisma.post.findMany({
    where: {
      likes: {
        some: {
          userId: user.id,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: {
          username: true,
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
      likes: currentUser
        ? {
            where: { userId: currentUser.id },
            select: {
              id: true,
            },
          }
        : false,
    },
  });

  return userPosts;
}

export async function getUserPosts(username: string) {
  const user = await getUserByUsername(username);

  if (!user) {
    return [];
  }

  const userPosts = await prisma.post.findMany({
    where: { userId: user.id },
    include: {
      author: {
        select: {
          username: true,
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
      likes: {
        select: {
          id: true,
        },
      },
    },
  });

  return userPosts;
}

export async function getLikedPosts(username: string) {
  const user = await getUserByUsername(username);

  if (!user) return [];

  const likedPosts = prisma.post.findMany({
    where: {
      likes: {
        some: {
          userId: user.id,
        },
      },
    },
    include: {
      author: {
        select: {
          username: true,
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
      likes: {
        select: {
          id: true,
        },
      },
    },
  });

  return likedPosts;
}

export async function toggleFollow(
  username: string | null | undefined,
  targetUsername: string | null,
) {
  if (!username || !targetUsername) return;
  const user = await getUserByUsername(username);

  if (!user) {
    return;
  }

  const targetUser = await prisma.user.findUnique({
    where: { username: targetUsername },
    include: {
      followers: {
        where: { id: user.id },
      },
    },
  });

  const alreadyFollowing =
    targetUser?.followers && targetUser.followers.length > 0;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      following: alreadyFollowing
        ? { disconnect: { id: targetUser.id } }
        : { connect: { id: targetUser?.id } },
    },
  });
}

export async function checkIfFollows(
  username: string,
  targetUsername: string,
): Promise<boolean> {
  const user = await getUserByUsername(username);
  if (!user) {
    return false;
  }

  const targetUser = await prisma.user.findUnique({
    where: { username: targetUsername },
    include: {
      followers: {
        where: { id: user.id },
      },
    },
  });

  return !!(targetUser?.followers && targetUser.followers.length > 0);
}
