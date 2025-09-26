import { formateDuration } from "@/lib/utils";
import Image from "next/image";

interface VideoThumbnailProps {
  alt?: string;
  title: string;
  className?: string;
  duration: number;
  imageUrl?: string | null;
  previewUrl?: string | null;
}

const VideoThumbnail = ({
  imageUrl,
  alt,
  previewUrl,
  title,
  duration,
  className,
}: VideoThumbnailProps) => {
  const src = imageUrl ?? "/placeholder.svg";
  const previewSrc = previewUrl ?? null;

  console.log("dd", imageUrl, alt, previewUrl, title, duration);
  return (
    <div className="relative group">
      <div className="relative w-full overflow-hidden rounded-xl aspect-video">
        <Image
          src={src}
          alt={alt ?? "video thumbnail"}
          fill
          className="h-full w-full object-cover transition-all duration-300 group-hover:opacity-0"
          sizes="(max-width:768px) 100vw, 33vw"
        />
        {previewSrc ? (
          <Image
            src={previewSrc}
            alt={`${title} preview`}
            fill
            className="h-full w-full object-cover opacity-0 transition-all duration-300 group-hover:opacity-100"
            sizes="(max-width: 768px) 100vw, 240px"
          />
        ) : null}
      </div>
      <div className="absolute right-2 bottom-2 bg-black/80 text-white text-xs font-medium rounded px-2 py-0.5">
        {formateDuration(duration ?? 0)}
      </div>
    </div>
  );
};

export default VideoThumbnail;
