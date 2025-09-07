import Link from "next/link";
import Image from "next/image";

import { SidebarTrigger } from "@/components/ui/sidebar";

import { SearchInput } from "@/modules/home/ui/components/home-navbar/search-input";
import { AuthButton } from "@/modules/auth/ui/components/AuthButton";
import { Menu } from "lucide-react";

export function HomeNavbar() {
  return (
    <nav className="fixed top-0 left-0 h-16 w-full bg-white flex items-center px-2 pr-5 z-50">
      {/* left Side */}
      <div className="flex items-center gap-4 w-full">
        {/* menu & logo */}
        <div className="flex items-center flex-shrink-0">
          <SidebarTrigger>
            <Menu />
          </SidebarTrigger>
          <Link href="/">
            <div className="p-4 flex items-center gap-1">
              <Image src="/logo.svg" alt="logo" width={32} height={32} />
              <p className="text-xl font-semibold tracking-tight">NewTube</p>
            </div>
          </Link>
        </div>
        {/* SearchBar (center/navbar) */}
        <div className="flex-1 flex justify-center max-w-[720px] mx-auto">
          <SearchInput />
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}
