import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@/app/trpc/routers/_app";

export type VideoGetOneOutput =
  inferRouterOutputs<AppRouter>["videos"]["getOne"];

export type videoGetManyOutput =
  inferRouterOutputs<AppRouter>["suggestion"]["getMany"]["items"];
