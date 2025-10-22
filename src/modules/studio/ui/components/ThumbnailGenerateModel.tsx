import { trpc } from "@/app/trpc/client";
import { ResponsiveModel } from "@/components/responsive-dialog";

import z from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";

interface ThumbnailUploadProps {
  videoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  prompt: z.string().min(10),
});

export const ThumbnailGenerateModel = ({
  videoId,
  open,
  onOpenChange,
}: ThumbnailUploadProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { prompt: "" },
  });

  const generateThumbnail = trpc.videos.generateThumbnail.useMutation({
    onSuccess: () => {
      toast.success("Background Job started.", {
        description: "This may take some time",
      });
      form.reset();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error("Something Went Wrong!");
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    generateThumbnail.mutate({ videoId: videoId, prompt: values.prompt });
  };

  return (
    <ResponsiveModel
      title="Upload a Thumbnail"
      open={open}
      onOpenChange={onOpenChange}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="resize-none cols-30 rows-5"
                      placeholder="A description of wanted thumbnail"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={generateThumbnail.isPending}>
              Generate
            </Button>
          </div>
        </form>
      </Form>
      <div className=" flex flex-col gap-0.5 justify-center h-full w-full bg-gray-300 hover:bg-gray-400 text-black"></div>
    </ResponsiveModel>
  );
};
