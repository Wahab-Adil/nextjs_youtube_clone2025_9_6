import { VideoGetOneOutput } from "../../types";
import { AlertTriangle } from "lucide-react";

interface VideoBannerProps {
  status: VideoGetOneOutput["muxStatus"];
}

export const VideoBanner = ({ status }: VideoBannerProps) => {
  if (status === "ready") return null;

  return (
    <div className="bg-yellow-500 flex items-center gap-2 p-2">
      <AlertTriangle className="size-4 text-black shrink-0" />
      <p className="text-sm sm:text-sm font-medium text-black line-clamp-1">
        This is still Being Processed
      </p>
    </div>
  );
};
