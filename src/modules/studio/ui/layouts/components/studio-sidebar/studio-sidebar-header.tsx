import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import UserAvatar from "@/components/user-avatar";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export const StudioSidebarHeader = () => {
  const { user } = useUser();
  const { state } = useSidebar();
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center pb-4">
        <Skeleton className="h-[112px] w-[112px] rounded-full" />
        <div className="flex flex-col items-center mt-2 gap-y-1">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    );
  }
  if (state === "collapsed") {
    return (
      <SidebarMenuButton
        className="flex justify-center rounded-full"
        asChild
        tooltip="Your Profile"
      >
        <Link href="users/current">
          <UserAvatar
            imageUrl={user.imageUrl}
            name={user.fullName || "User"}
            size="xs"
          />
          <span className="text-sm">Your Profile</span>
        </Link>
      </SidebarMenuButton>
    );
  }

  return (
    <div className="flex items-center justify-center pb-4">
      <Link href="/users/current">
        <UserAvatar
          imageUrl={user.imageUrl}
          name={user.fullName || "User"}
          className="h-[112px] w-[112px] transition hover:opacity-80"
        />
        <div className="flex flex-col items-center mt-2">
          <p className="text-sm font-medium space-y-1">Your Profile</p>
          <p className="text-xs text-muted-foreground">{user.fullName}</p>
        </div>
      </Link>
    </div>
  );
};
