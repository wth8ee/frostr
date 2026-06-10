"use client";

import React, { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Google, Github } from "@thesvg/react";
import { authClient } from "@/lib/auth-client";

export default function SignIn() {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!account.includes("@")) {
        await authClient.signIn.username(
          {
            username: account.trim(),
            password: password,
          },
          {
            onSuccess: () => {
              window.location.href = "/";
            },
            onError: (ctx) => {
              console.log(ctx.error.message);
            },
          },
        );
      } else {
        await authClient.signIn.email(
          {
            email: account,
            password: password,
          },
          {
            onSuccess: () => {
              window.location.href = "/";
            },
            onError: (ctx) => {
              console.log(ctx.error.message);
            },
          },
        );
      }
      await authClient.signIn.username(
        {
          username: account.trim(),
          password: password,
        },
        {
          onSuccess: () => {
            window.location.href = "/";
          },
          onError: (ctx) => {
            console.log(ctx.error.message);
          },
        },
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-1 items-start justify-center p-4 pt-12 min-h-screen">
      <Card className="w-full max-w-md bg-sidebar border border-solid shadow-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-semibold tracking-tight text-foreground">
            Sign In
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Enter your details below to access your account
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="w-full font-medium flex items-center justify-center gap-2"
              onClick={() => {
                /* Better Auth Google sign-in */
              }}
            >
              <Google className="h-4 w-4" />
              Google
            </Button>
            <Button
              variant="outline"
              className="w-full font-medium flex items-center justify-center gap-2"
              onClick={() => {
                /* Better Auth GitHub sign-in */
              }}
            >
              <Github className="h-4 w-4" />
              GitHub
            </Button>
          </div>
          <div className="relative flex items-center py-2">
            <div className="grow border-t border-solid opacity-50"></div>
            <span className="shrink mx-4 text-xs uppercase text-muted-foreground tracking-wider">
              or via password
            </span>
            <div className="grow border-t border-solid opacity-50"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="account" className="text-sm font-medium">
                Username or Email
              </Label>
              <Input
                onChange={(e) => setAccount(e.target.value)}
                value={account}
                id="account"
                type="text"
                placeholder="frosty or name@example.com"
                required
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-muted-foreground hover:underline underline-offset-2"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>

            <Button type="submit" className="w-full mt-2 font-medium">
              Sign In
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col justify-center text-center pt-0">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="font-medium text-primary hover:underline underline-offset-4"
            >
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
