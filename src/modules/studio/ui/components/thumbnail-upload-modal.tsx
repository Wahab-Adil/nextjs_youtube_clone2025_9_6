import { trpc } from "@/app/trpc/client";
import { ResponsiveModel } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/lib/uploadthing";

interface ThumbnailUploadProps {
  videoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ThumbnailUploadModal = ({
  videoId,
  open,
  onOpenChange,
}: ThumbnailUploadProps) => {
  const utils = trpc.useUtils();

  const onClickUploadComplete = () => {
    utils.studio.getMany.invalidate();
    utils.studio.getOne.invalidate();
    onOpenChange(false);
  };
  return (
    <ResponsiveModel
      title="Upload a Thumbnail"
      open={open}
      onOpenChange={onOpenChange}
    >
      <Button className=" flex flex-col gap-0.5 justify-center h-full w-full bg-gray-300 hover:bg-gray-400 text-black">
        <UploadDropzone
          endpoint="thumbnailUrl"
          input={{ videoId }}
          onClientUploadComplete={onClickUploadComplete}
        />
      </Button>
    </ResponsiveModel>
  );
};
