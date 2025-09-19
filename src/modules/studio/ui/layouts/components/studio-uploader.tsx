import React from "react";

import MuxUploader, {
  MuxUploaderDrop,
  MuxUploaderFileSelect,
  MuxUploaderProgress,
  MuxUploaderStatus,
} from "@mux/mux-uploader-react";

export interface StudioUploaderProps {
  endpoint: string;
  onSuccess?: () => void;
}

export const StudioUploader: React.FC<StudioUploaderProps> = ({
  endpoint,
  onSuccess,
}) => {
  return (
    <div>
      <MuxUploader
        endpoint={endpoint}
        onSuccess={() => onSuccess?.()}
      ></MuxUploader>
    </div>
  );
};
