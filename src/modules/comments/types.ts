import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@/app/trpc/routers/_app";

export type CommentsGetManyOutput =
  inferRouterOutputs<AppRouter>["comments"]["getMany"]["items"];
