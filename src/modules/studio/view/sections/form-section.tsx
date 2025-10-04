"use client";

import { Suspense } from "react";
import { trpc } from "@/app/trpc/client";
import { Button } from "@/components/ui/button";
import { ErrorBoundary } from "react-error-boundary";

import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
  FormControl,
} from "@/components/ui/form";

import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { VideoUpdateSchame } from "@/db/schema";
import { MoreVertical, Trash } from "lucide-react";
import { toast } from "sonner";
import { VideoPlayer } from "@/modules/videos/ui/components/VideoPlayer";

interface FormSectionProps {
  videoId: string;
}

export const FormSection = ({ videoId }: { videoId: string }) => {
  return (
    <Suspense fallback={<FormSectionSkeleton />}>
      <ErrorBoundary fallback={"Error"}>
        <FormSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const FormSectionSkeleton = () => <p>Loading...</p>;

export const FormSectionSuspense = ({ videoId }: FormSectionProps) => {
  const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId });
  const [categories] = trpc.categories.getMany.useSuspenseQuery();
  const utils = trpc.useUtils();
  const update = trpc.videos.update.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      utils.studio.getOne.invalidate();
      toast.success("Video Updated !");
    },
    onError: () => {
      toast.error("Something Went Wrong");
    },
  });

  const form = useForm<z.infer<typeof VideoUpdateSchame>>({
    resolver: zodResolver(VideoUpdateSchame),
    defaultValues: video,
  });

  const onSubmit = (data: z.infer<typeof VideoUpdateSchame>) => {
    update.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Video details</h1>
            <p className="text-xs text-muted-foreground">
              Manage your video details
            </p>
          </div>
          <div className="flex items-center gap-x-2">
            <Button type="submit" disabled={update.isPending}>
              Save
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"ghost"} size={"icon"}>
                  <MoreVertical />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Trash className="size-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Column: Fields */}
          <div className="space-y-8 lg:col-span-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Add a title to your video" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add Description"
                      rows={10}
                      className="resize-none pr-10"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  {" "}
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        {" "}
                        <SelectValue placeholder="Select a Category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
          {/* Right Column: additional UI will go here later */}

          <div className="flex flex-col gap-y-8 lg:col-span-2">
            <div className="flex flex-col gap-4 bg-[#f9f9f9] rounded-xl overflow-hidden h-fit">
              <div className="aspect-video overflow-hidden relative">
                <VideoPlayer
                  playbackId={video.muxPlaybackId}
                  thumbnailUrl={video.thumbnailUrl}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};
