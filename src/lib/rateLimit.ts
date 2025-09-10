import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/app/trpc/init";

export const rateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "10s"),
  analytics: true,
});
