import { auth } from "@/lib/auth";
import { NextRequest } from "next/server";

const handler = async (req: NextRequest) => {
  const headers = new Headers(req.headers);

  if (process.env.NODE_ENV === "production") {
    headers.set("origin", "https://vercel.app");
  }

  const modifiedReq = new NextRequest(req, {
    headers,
  });

  return auth.handler(modifiedReq);
};

export { handler as GET, handler as POST };
