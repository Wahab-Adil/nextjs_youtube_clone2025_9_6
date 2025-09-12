import React, { useEffect, useState } from "react";

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";

interface filterCarouselProps {
  value?: string | null | undefined;
  isLoading?: boolean;
  onSelect: (value: string | null) => void;
  data: {
    value: string;
    lebal: string;
  }[];
}

const FilterCarousel = ({
  value,
  data,
  onSelect,
  isLoading,
}: filterCarouselProps) => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="relative w-full">
      {/* left fade */}
      <div
        className={cn(
          "absolute left-12 top-0 bottom-0 w-12 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent ",
          current === 1 && "hidden"
        )}
      />
      <Carousel
        setApi={setApi}
        opts={{ align: "start", dragFree: true }}
        className="w-full px-12"
      >
        <CarouselPrevious className="left-0 z-20" />
        <CarouselContent className="-ml-3 basis-auto">
          {!isLoading && (
            <CarouselItem
              onClick={() => onSelect?.(null)}
              className="pl-3 basis-auto"
            >
              <Badge
                variant={!value ? "default" : "secondary"}
                className="rounded-lg px-3 py-1 cursor-pointer whitespace-nowrap text-sm"
              >
                All
              </Badge>
            </CarouselItem>
          )}

          {isLoading &&
            Array.from({ length: 14 }).map((_, index) => {
              return (
                <CarouselItem key={index} className="pl-4 basis-auto">
                  <Skeleton className="rounded-lg px-3 py-1 h-full w-[100px] bg-gray-200 animate-pulse">
                    &nbsp;
                  </Skeleton>
                </CarouselItem>
              );
            })}
          {!isLoading &&
            data.map((item) => (
              <CarouselItem
                onClick={() => {
                  onSelect?.(item.value);
                }}
                key={item.value}
                className="pl-3 basis-auto"
              >
                <Badge
                  variant={value === null ? "default" : "secondary"}
                  className="rounded-lg px-3 py-1 cursor-pointer whitespace-nowrap text-sm"
                >
                  {item.lebal}
                </Badge>
              </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselNext className="right-0 z-20" />
        {/* Right fade */}
        <div
          className={cn(
            "absolute right-12 top-0 bottom-0 w-12 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent ",
            current === count && "hidden"
          )}
        />
      </Carousel>
    </div>
  );
};

export default FilterCarousel;
