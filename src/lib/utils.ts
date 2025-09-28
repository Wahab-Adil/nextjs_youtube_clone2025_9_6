import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formateDuration(duration: number): string {
  const totalSeconds = Math.floor(duration / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

export function snakeCaseToTitle(title?: string | null): string {
  if (!title) return "";
  return title.replace(/[_\-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
