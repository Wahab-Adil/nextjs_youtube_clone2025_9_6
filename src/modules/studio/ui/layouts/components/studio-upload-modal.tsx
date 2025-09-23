"use client";
import { toast } from "sonner";
import { trpc } from "@/app/trpc/client";
import { Button } from "@/components/ui/button";
import { Loader2Icon, Plus } from "lucide-react";
import { ResponsiveModel } from "@/components/responsive-dialog";
import { StudioUploader } from "./studio-uploader";

const StudioUploadModal = () => {
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
            onSuccess={() => {}}
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
