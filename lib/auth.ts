import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { username } from "better-auth/plugins";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  baseURL:
    process.env.BETTER_AUTH_URL ||
    `https://${process.env.VERCEL_URL}` ||
    "http://localhost:3000",

  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    crossOrigin: true,
    disableCSRFCheck: true,
  },
  trustedOrigins: ["https://vercel.app", `https://${process.env.VERCEL_URL}`],
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: "",
      clientSecret: "",
    },
    google: {
      clientId: "",
      clientSecret: "",
    },
  },
  user: {
    additionalFields: {
      bio: {
        type: "string",
        required: false,
      },
    },
  },
  plugins: [
    nextCookies(),
    username({
      minUsernameLength: 5,
      maxUsernameLength: 20,
      displayUsernameValidator: (displayUsername) => {
        return /^[a-zA-Z0-9_-]+$/.test(displayUsername);
      },
    }),
  ],
});

export type AuthUser = typeof auth.$Infer.Session.user;
