import Image from "next/image";

interface VideoThumbnailProps {
  imageUrl?: string | null;
  alt?: string;
}

const VideoThumbnail = ({ imageUrl, alt }: VideoThumbnailProps) => {
  console.log("image", imageUrl);
  const src = imageUrl ?? "/placeholder.svg";

  return (
    <div className="relative">
      <div className="relative w-full overflow-hidden rounded-xl aspect-video">
        <Image
          src={src}
          alt={alt ?? "video thumbnail"}
          fill
          className="w-full h-full object-cover"
          sizes="(max-width:768px) 100vw, 33vw"
        />
      </div>
    </div>
  );
};

export default VideoThumbnail;
