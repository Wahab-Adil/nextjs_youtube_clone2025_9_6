"use client";

import { useClerk, useAuth } from "@clerk/nextjs";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Home, PlaySquare, Flame } from "lucide-react";

const items = [
  { title: "Home", url: "/", icon: Home },
  {
    title: "Subscribed",
    url: "/feed/subscribed",
    icon: PlaySquare,
    auth: true,
  },
  { title: "Trending", url: "/feed/trending", icon: Flame },
];

export const MainSection = () => {
  const clerk = useClerk();
  const { isSignedIn } = useAuth();

  return (
    <SidebarGroup>
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
