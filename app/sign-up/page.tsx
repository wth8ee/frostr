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
import { authClient } from "../../lib/auth-client";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await authClient.signUp.email(
        {
          email,
          password,
          username: username.toLowerCase().trim(),
          name: username,
        },
        {
          onSuccess: () => {
            window.location.href = "/";
          },
        },
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-1 items-start justify-center p-4 pt-12 overflow-hidden min-h-screen max-h-screen">
      <Card className="w-full max-w-md bg-sidebar border border-solid shadow-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-semibold tracking-tight text-foreground">
            Create an account
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Enter your details below to join Frostr
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
              or via email
            </span>
            <div className="grow border-t border-solid opacity-50"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="username" className="text-sm font-medium">
                Username
              </Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                id="username"
                type="text"
                placeholder="frosty"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                type="email"
                placeholder="name@example.com"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
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
              Sign Up
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col justify-center text-center pt-0">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-primary hover:underline underline-offset-4"
            >
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
