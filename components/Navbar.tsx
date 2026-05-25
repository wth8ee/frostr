"use client";
import { Button } from "./ui/button";
import { ModeToggle } from "./ModeToggle";
import { SidebarTrigger } from "./ui/sidebar";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Avatar } from "@/components/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogOut, Settings, User } from "lucide-react";
import { signOut } from "@/lib/auth-actions";
import { useAuth } from "@/context/AuthContext";

function Navbar() {
  const { session } = useAuth();

  return (
    <nav className="w-full p-2 flex items-center justify-between bg-transparent">
      <SidebarTrigger />
      <div className="flex gap-2">
        <ModeToggle />
        {!session && (
          <>
            <Button
              asChild
              variant="outline"
              className="border border-solid border-primary"
            >
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </>
        )}
        {session && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar
                className="aspect-square h-9 cursor-pointer bg-black rounded-[35%] overflow-hidden border border-solid border-black"
                seed={session.user.username || "John Doe"}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="min-w-40"
            >
              <DropdownMenuLabel>{session.user.username}</DropdownMenuLabel>
              <DropdownMenuItem>
                Profile
                <DropdownMenuShortcut>
                  <User />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Settings
                <DropdownMenuShortcut>
                  <Settings />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={signOut}>
                Log Out
                <DropdownMenuShortcut>
                  <LogOut className="text-destructive" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
