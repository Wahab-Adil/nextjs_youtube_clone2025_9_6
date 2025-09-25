import React from "react";

import MuxUploader, {
  MuxUploaderDrop,
  MuxUploaderFileSelect,
  MuxUploaderProgress,
  MuxUploaderStatus,
} from "@mux/mux-uploader-react";

import { UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface StudioUploaderProps {
  endpoint: string;
  onSuccess?: () => void;
}

const UPLOADER_ID = "video-uploader";

export const StudioUploader: React.FC<StudioUploaderProps> = ({
  endpoint,
  onSuccess,
}) => {
  return (
    <div>
      <MuxUploader
        id={UPLOADER_ID}
        endpoint={endpoint}
        onSuccess={() => onSuccess?.()}
        className="hidden group/uploader"
      />
      <MuxUploaderDrop id={UPLOADER_ID} className="group/drop">
        <div slot="heading" className="flex flex-col items-center gap-6">
          <div className="flex items-center  justify-center gap-2 rounded-full bg-muted h-32 w-32">
            <UploadIcon className="size-10 text-muted-foreground group-drop-[&[active]]:animate:bounce transition-all duration-300" />
          </div>
          <div className="flex flex-col gap-2 text-center">
            <p className="text-sm">Drag & Drop video files to upload</p>
            <p className="text-xs text-muted-foreground">
              Your videos will be private until published
            </p>
          </div>
          <MuxUploaderFileSelect muxUploader={UPLOADER_ID}>
            <Button type="button" className="rounded-full">
              Select Files
            </Button>
          </MuxUploaderFileSelect>
        </div>
        <span slot="separator" className="hidden" />
        <MuxUploaderStatus muxUploader={UPLOADER_ID} className="text-sm" />
        <MuxUploaderProgress
          muxUploader={UPLOADER_ID}
          type="percentage"
          className="text-sm"
        />
        <MuxUploaderProgress muxUploader={UPLOADER_ID} type="bar" />
      </MuxUploaderDrop>
    </div>
  );
};
