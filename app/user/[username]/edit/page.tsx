import { EditProfile } from "@/components/EditProfile";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface RouteParams {
  params: Promise<{
    username: string;
  }>;
}

export default async function EditProfilePage({ params }: RouteParams) {
  const { username } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const currentUser = session?.user;

  if (!currentUser || currentUser.username !== username) {
    return;
  }

  return <EditProfile user={currentUser} />;
}
