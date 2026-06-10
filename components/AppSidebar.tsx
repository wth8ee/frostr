"use client";

import {
  Home,
  Mail,
  Bell,
  User,
  Users,
  Bookmark,
  Settings,
  SnowflakeIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export function AppSidebar() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const mainNavItems = [
    { title: "Home", url: "/", icon: Home },
    { title: "Messages", url: user ? "/" : "/sign-in", icon: Mail },
    { title: "Notifications", url: user ? "/" : "/sign-in", icon: Bell },
    {
      title: "Profile",
      url: user ? `/user/${user.username}` : "/sign-in",
      icon: User,
    },
    { title: "Friends", url: user ? "/" : "/sign-in", icon: Users },
    { title: "Saved", url: user ? "/" : "/sign-in", icon: Bookmark },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="flex items-center py-2 gap-3">
              <SnowflakeIcon className="h-5 w-5 text-primary" />
              <span className="text-base">Frostr</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className="flex items-center gap-3 py-2"
                    >
                      <item.icon className="h-5 w-5 text-primary" />
                      <span className="text-base">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/" className="flex items-center gap-3">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
