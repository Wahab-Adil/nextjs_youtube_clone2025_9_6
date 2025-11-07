import z from "zod";
import { useForm } from "react-hook-form";
import { commentInsertSchema } from "@/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";
import { trpc } from "@/app/trpc/client";
import {
  Form,
  FormItem,
  FormField,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useClerk, useUser } from "@clerk/nextjs";
import UserAvatar from "@/components/user-avatar";
import { Textarea } from "@/components/ui/textarea";

interface CommentFormProps {
  videoId: string;
  parentId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  variant?: "comment" | "reply";
}

export const CommentForm = ({
  videoId,
  onSuccess,
  parentId,
  onCancel,
  variant = "comment",
}: CommentFormProps) => {
  const { user } = useUser();
  const clerk = useClerk();

  const commentFormSchema = commentInsertSchema.omit({ userId: true });
  const form = useForm<z.infer<typeof commentFormSchema>>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      parentId,
      videoId,
      value: "",
    },
  });

  const utils = trpc.useUtils();

  const createComment = trpc.comments.create.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ videoId });
      form.reset();
      toast.success("comment Added");
      onSuccess?.();
    },
    onError: (error) => {
      if (error?.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      }
      toast.error("something Went Wrong");
    },
  });

  const handleSubmit = (values: z.infer<typeof commentFormSchema>) => {
    createComment.mutate(values);
  };

  const handleCancel = () => {
    form.reset();
    onCancel?.();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex gap-4 group"
      >
        <UserAvatar
          size="lg"
          imageUrl={user?.imageUrl || "user-placeholder"}
          name={user?.username || "user"}
        />
        <div className="flex-1">
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={
                      variant === "reply"
                        ? "Reply to this comment..."
                        : "Add a comment..."
                    }
                    className="resize-none bg-transparent overflow-hidden min-h-0"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2 mt-2">
            {onCancel && (
              <Button variant="ghost" type="button" onClick={handleCancel}>
                Cancel
              </Button>
            )}
            <Button disabled={createComment.isPending} type="submit" size="sm">
              {variant === "reply" ? "reply" : "Comment"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
