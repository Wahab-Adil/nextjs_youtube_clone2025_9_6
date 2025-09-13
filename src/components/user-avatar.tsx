import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const avatarVariants = cva("", {
  variants: {
    size: {
      xs: "h-4 w-4",
      sm: "h-6 w-6",
      lg: "h-10 w-10",
      xl: "h-[160px] w-[160px]",
    },
  },
  defaultVariants: { size: "lg" },
});

interface UserAvatarProps extends VariantProps<typeof avatarVariants> {
  imageUrl: string;
  name: string;
  className?: string;
  onClick?: () => void;
}

const UserAvatar = ({
  imageUrl,
  name,
  className,
  size,
  onClick,
}: UserAvatarProps) => {
  return (
    <Avatar
      className={cn((avatarVariants({ size }), className))}
      onClick={onClick}
    >
      <AvatarImage src={imageUrl} alt={name} />
    </Avatar>
  );
};

export default UserAvatar;
