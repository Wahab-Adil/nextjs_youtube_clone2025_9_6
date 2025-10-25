import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";
import React from "react";

interface SubscriptionButtonProps {
  onClick?: ButtonProps["onClick"];
  disabled?: boolean;
  isSubscribed?: boolean;
  className: string;
  size?: ButtonProps["size"];
}

export const SubscriptionButton = ({
  onClick,
  disabled,
  isSubscribed,
  className,
  size,
}: SubscriptionButtonProps) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      size={size}
      variant={isSubscribed ? "secondary" : "default"}
      className={cn("rounded-full", className)}
    >
      {isSubscribed ? "Unsubscribe" : "Subscribe"}
    </Button>
  );
};
