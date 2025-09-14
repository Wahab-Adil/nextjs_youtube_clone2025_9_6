"use client";
import { trpc } from "@/app/trpc/client";
import { Button } from "@/components/ui/button";
import { Loader2Icon, Plus } from "lucide-react";
import { toast } from "sonner";

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
    <Button variant="secondary" onClick={() => createVideo.mutate()}>
      {createVideo.isPending ? (
        <Loader2Icon className="animate-spin" />
      ) : (
        <Plus className="size-4" />
      )}
      Create
    </Button>
  );
};

export default StudioUploadModal;
