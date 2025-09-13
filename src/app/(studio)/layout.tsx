import { StudioLayout } from "@/modules/studio/ui/layouts/StudioLayout";
interface LayoutProps {
  children: React.ReactNode;
}

const Homelayout = ({ children }: LayoutProps) => {
  return <StudioLayout>{children}</StudioLayout>;
};

export default Homelayout;
