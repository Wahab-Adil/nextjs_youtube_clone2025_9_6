import { SidebarProvider } from "@/components/ui/sidebar";
import { SutdioNavbar } from "@/modules/studio/ui/layouts/components/studio-navbar";
import { StudioSidebar } from "@/modules/studio/ui/layouts/components/studio-sidebar";

interface StudioLayoutProps {
  children: React.ReactNode;
}

export const StudioLayout = ({ children }: StudioLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="w-full">
        <SutdioNavbar />
        <div className="flex min-h-screen pt-[4rem]">
          <StudioSidebar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};
