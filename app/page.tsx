import { HomeClient } from "@/components/HomeClient";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const currentUserId = session?.user.id;

  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
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

      likes: currentUserId
        ? {
            where: {
              userId: currentUserId,
            },
            select: {
              id: true,
            },
          }
        : false,
    },
  });

  return <HomeClient posts={posts} />;
}
