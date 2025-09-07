"use client";

import { useClerk, useAuth } from "@clerk/nextjs";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { History, ThumbsUp, ListVideo } from "lucide-react";

const items = [
  { title: "History", url: "/playlists/history", icon: History, auth: true },
  {
    title: "Liked Videos",
    url: "/playlists/liked",
    icon: ThumbsUp,
    auth: true,
  },
  { title: "All Playlists", url: "/playlists", icon: ListVideo, auth: true },
];

export const PersonalSection = () => {
  const clerk = useClerk();
  const { isSignedIn } = useAuth();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>You</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  asChild
                  isActive={false}
                  onClick={(e) => {
                    if (!isSignedIn && item.auth) {
                      e.preventDefault();
                      return clerk.openSignIn();
                    }
                  }}
                >
                  <Link href={item.url}>
                    <item.icon />
                    <span className="flex items-center gap-4 text-sm">
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
