"use client";
import { toast } from "sonner";
import { trpc } from "@/app/trpc/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2Icon, Plus } from "lucide-react";
import { ResponsiveModel } from "@/components/responsive-dialog";
import { StudioUploader } from "./studio-uploader";

const StudioUploadModal = () => {
  const router = useRouter();
  const utils = trpc.useUtils();

  const createVideo = trpc.videos.create.useMutation({
    onSuccess: () => {
      toast.success("video Created.");
      utils.studio.getMany.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSuccess = () => {
    if (!createVideo.data?.video?.id) return;

    createVideo.reset();
    router.push(`/studio/videos/${createVideo.data.video.id}`);
  };

  return (
    <>
      <ResponsiveModel
        open={!!createVideo.data?.url}
        title="Upload a Video"
        onOpenChange={() => createVideo.reset()}
      >
        {createVideo?.data?.url ? (
          <StudioUploader
            endpoint={createVideo?.data?.url}
            onSuccess={onSuccess}
          />
        ) : (
          <Loader2Icon className="animate-spin" />
        )}
      </ResponsiveModel>
      <Button
        onClick={() => {
          createVideo.mutate();
        }}
        variant="secondary"
        className="hover:cursor-pointer"
      >
        {createVideo.isPending ? (
          <Loader2Icon className="animate-spin" />
        ) : (
          <Plus className="size-4" />
        )}
        Create
      </Button>
    </>
  );
};

export default StudioUploadModal;
