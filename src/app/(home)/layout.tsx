import { HomeLayout } from "@/modules/home/ui/layouts/home-layout";
interface LayoutProps {
  children: React.ReactNode;
}

const Homelayout = ({ children }: LayoutProps) => {
  return <HomeLayout>{children}</HomeLayout>;
};

export default Homelayout;
