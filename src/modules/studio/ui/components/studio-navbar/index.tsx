import Link from "next/link";
import Image from "next/image";

import { SidebarTrigger } from "@/components/ui/sidebar";

import { AuthButton } from "@/modules/auth/ui/components/AuthButton";
import { Menu } from "lucide-react";
import StudioUploadModal from "../studio-upload-modal";

export function SutdioNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 w-full bg-white flex items-center px-2 pr-5 z-50 border-b shadow-md ">
      {/* left Side */}
      <div className="flex justify-between gap-4 w-full">
        {/* menu & logo */}
        <div className="flex items-center flex-shrink-0">
          <SidebarTrigger>
            <Menu />
          </SidebarTrigger>
          <Link href="/">
            <div className="p-4 flex items-center gap-1">
              <Image src="/logo.svg" alt="logo" width={32} height={32} />
              <p className="text-xl font-semibold tracking-tight">Studio</p>
            </div>
          </Link>
        </div>
        {/* SearchBar (center/navbar) */}

        <div className="flex shrink-0 items-center gap-4">
          <StudioUploadModal />
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}
