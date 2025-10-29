import { toast } from "sonner";
import { useClerk } from "@clerk/nextjs";
import { trpc } from "@/app/trpc/client";

interface useSubscriptionProps {
  userId: string;
  isSubscribed: boolean;
  fromVideoId?: string;
}

export const useSubscription = ({
  userId,
  isSubscribed,
  fromVideoId,
}: useSubscriptionProps) => {
  const clerk = useClerk();
  const utils = trpc.useUtils();

  const subscribe = trpc.subscription.create.useMutation({
    onSuccess: () => {
      toast.success("Subscribed");
      if (fromVideoId) {
        utils.videos.getOne.invalidate({ videoId: fromVideoId });
      }
      // TODO: invalidate subscriptions.getMany and users.getOne later
    },
    onError: (error) => {
      toast.error("Something went wrong");
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      }
    },
  });

  const unSubscribe = trpc.subscription.remove.useMutation({
    onSuccess: () => {
      toast.success("Unsubscribed");
      if (fromVideoId) {
        utils.videos.getOne.invalidate({ videoId: fromVideoId });
      }
      // TODO: invalidate subscriptions.getMany and users.getOne later
    },
    onError: (error) => {
      toast.error("Something went wrong");
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      }
    },
  });
  const isPending = subscribe.isPending || unSubscribe.isPending;

  const onClick = () => {
    if (isSubscribed) {
      unSubscribe.mutate({ userId });
    } else {
      subscribe.mutate({ userId });
    }
  };

  return { isPending, onClick };
};
