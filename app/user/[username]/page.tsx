import UserNotFound from "@/components/UserNotFound";
import { UserProfile } from "@/components/UserProfile";
import {
  checkIfFollows,
  getLikedPostsWithCurrentUserLikes,
  getUserByUsername,
  getUserPostsWithCurrentUserLikes,
} from "@/lib/actions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface RouteParams {
  params: Promise<{
    username: string;
  }>;
}

export default async function UserProfilePage({ params }: RouteParams) {
  const { username } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const currentUser = await getUserByUsername(session?.user?.username || "");
  const user = await getUserByUsername(username);
  const userPosts = await getUserPostsWithCurrentUserLikes(
    username,
    currentUser?.username || "",
  );
  const likedPosts = await getLikedPostsWithCurrentUserLikes(
    username,
    currentUser?.username || "",
  );

  let isFollowing = false;

  if (session?.user?.username) {
    isFollowing = !!(
      session?.user.username &&
      (await checkIfFollows(session.user.username, username))
    );
  }

  if (!user) {
    return <UserNotFound />;
  }

  return (
    <UserProfile
      user={user}
      initialIsFollowing={isFollowing}
      userPosts={userPosts}
      likedPosts={likedPosts}
      currentUser={currentUser}
    />
  );
}
