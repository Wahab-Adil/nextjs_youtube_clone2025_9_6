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
        open={!!createVideo.data}
        title="Upload a Video"
        onOpenChange={createVideo.reset}
      >
        <StudioUploader endpoint="DD" />
      </ResponsiveModel>
      <Button variant="secondary">
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
