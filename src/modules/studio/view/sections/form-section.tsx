"use client";

import Link from "next/link";
import Image from "next/image";
import { trpc } from "@/app/trpc/client";
import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { snakeCaseToTitle } from "@/lib/utils";
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

import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { VideoUpdateSchame } from "@/db/schema";
import {
  Copy,
  CopyCheck,
  Globe2Icon,
  ImagePlus,
  Loader2Icon,
  LockIcon,
  MoreVertical,
  RotateCcw,
  Sparkles,
  SparklesIcon,
  Trash,
} from "lucide-react";
import { THUMBNAIL_FALLBACK } from "@/modules/videos/constants";
import { VideoPlayer } from "@/modules/videos/ui/components/VideoPlayer";
import { ThumbnailUploadModal } from "../../ui/components/thumbnail-upload-modal";

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
  const router = useRouter();

  const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId });

  const [thumbnailModalOpen, setThumbnailModalOpen] = useState(false);

  const fullUrl = `${process.env.VERCEL_URL ?? "http://localhost:3000"}/watch/${
    video.id
  }`;

  const [isCopied, setIsCopied] = useState<boolean>(false);
  const onCopy = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

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

  const deleteVideo = trpc.videos.remove.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      toast.success("video deleted.");
      router.push("/studio");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const generateDescription = trpc.videos.generateDescription.useMutation({
    onSuccess: () => {
      toast.success("Background Job started.", {
        description: "This may take some time",
      });
    },
    onError: (error) => {
      toast.error("Something Went Wrong!");
    },
  });

  const generateTitle = trpc.videos.generateTitle.useMutation({
    onSuccess: () => {
      toast.success("Background Job started.", {
        description: "This may take some time",
      });
    },
    onError: (error) => {
      toast.error("Something Went Wrong!");
    },
  });

  const generateThumbnail = trpc.videos.generateThumbnail.useMutation({
    onSuccess: () => {
      toast.success("Background Job started.", {
        description: "This may take some time",
      });
    },
    onError: (error) => {
      toast.error("Something Went Wrong!");
    },
  });

  const restoreThumbnail = trpc.videos.restoreThumbnail.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      utils.studio.getOne.invalidate({ id: videoId });
      toast.success("thumbnail restored.");
    },
    onError: (error) => {
      toast.error(error.message);
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
    <>
      <ThumbnailUploadModal
        videoId={video.id}
        open={thumbnailModalOpen}
        onOpenChange={setThumbnailModalOpen}
      />
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
                  <DropdownMenuItem
                    onClick={() => deleteVideo.mutate({ id: video.id })}
                  >
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
                    <FormLabel>
                      <div className="flex items-center gap-x-2">
                        Title
                        <Button
                          size="icon"
                          variant="outline"
                          type="button"
                          className="rounded-full size-6 [&_svg]:size-3"
                          onClick={() => {
                            generateTitle.mutate({ videoId: video.id });
                          }}
                          disabled={
                            generateTitle.isPending || !video.muxTrackId
                          }
                        >
                          {generateTitle.isPending ? (
                            <Loader2Icon className="animate-spin" />
                          ) : (
                            <SparklesIcon />
                          )}
                        </Button>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Add a title to your video"
                      />
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
                    <div className="flex items-center gap-x-2">
                      Description
                      <Button
                        size="icon"
                        variant="outline"
                        type="button"
                        className="rounded-full size-6 [&_svg]:size-3"
                        onClick={() => {
                          generateDescription.mutate({ videoId: video.id });
                        }}
                        disabled={
                          generateDescription.isPending || !video.muxTrackId
                        }
                      >
                        {generateDescription.isPending ? (
                          <Loader2Icon className="animate-spin" />
                        ) : (
                          <SparklesIcon />
                        )}
                      </Button>
                    </div>
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
                name="thumbnailUrl"
                render={() => {
                  return (
                    <FormItem>
                      <FormLabel>Thumbnail</FormLabel>
                      <FormControl>
                        <div className="p-0.5 border border-dashed border-neutral-400 relative h-[84px] w-[153px] group">
                          <Image
                            fill
                            alt="thumbnail"
                            src={video.thumbnailUrl || THUMBNAIL_FALLBACK}
                            className="object-cover"
                          />
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                type="button"
                                size="icon"
                                className="absolute right-1 top-1 black/50 hover:bg-black/50 text-white rounded-full md:opacity-0 group-hover:opacity-100 duration-300 size-7"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" side="right">
                              <DropdownMenuItem
                                onClick={() => setThumbnailModalOpen(true)}
                              >
                                <ImagePlus className="w-4 h-4 mr-1" />
                                Change
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  generateThumbnail.mutate({
                                    videoId: video.id,
                                  })
                                }
                              >
                                <Sparkles className="w-4 h-4 mr-1" />
                                AI Generated
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  restoreThumbnail.mutate({ videoId: video.id })
                                }
                              >
                                <RotateCcw className="w-4 h-4 mr-1" />
                                Restore
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </FormControl>
                    </FormItem>
                  );
                }}
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

            <div className="flex flex-col gap-y-8 lg:col-span-2  ">
              <div className="flex flex-col gap-4 bg-[#f9f9f9] rounded-xl overflow-hidden h-fit">
                <div className="aspect-video overflow-hidden relative">
                  <VideoPlayer
                    playbackId={video.muxPlaybackId}
                    thumbnailUrl={video.thumbnailUrl}
                  />
                </div>
              </div>
              <div className="p-4 flex flex-col gap-y-6">
                <div className="flex justify-between items-center gap-x-2">
                  <div className="flex flex-col gap-y-1">
                    <p className="text-muted-foreground text-xs">Video Link</p>
                    <div className="flex items-center gap-2">
                      <Link
                        className="flex flex-nowrap "
                        href={`/watch/${video.id}`}
                      >
                        <p className="line-clamp-1 text-sm text-blue-500">
                          {fullUrl}
                        </p>
                        <Button
                          type="button"
                          variant={"ghost"}
                          size={"icon"}
                          className="shrink-0"
                          onClick={onCopy}
                          disabled={isCopied}
                        >
                          {isCopied ? (
                            <CopyCheck className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex flex-col gap-y-1">
                    <p className="text-muted-foreground text-xs">
                      Video Status
                    </p>
                    <p className="text-sm">
                      {snakeCaseToTitle(video.muxStatus) || "preparing"}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col gap-y-1">
                    <p className="text-muted-foreground text-xs">
                      Subtitles Status
                    </p>
                    <p className="text-sm">
                      {snakeCaseToTitle(video.muxTrackStatus) || "no_subtitles"}
                    </p>
                  </div>
                </div>
                <div className=" mb-5 w-full">
                  <FormField
                    control={form.control}
                    name="visibility"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Visibility</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field?.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select visibility" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            <SelectItem value="public">
                              <Globe2Icon className="size-4 mr-2" /> Public
                            </SelectItem>

                            <SelectItem value="private">
                              <LockIcon className="size-4 mr-2" /> Private
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};
