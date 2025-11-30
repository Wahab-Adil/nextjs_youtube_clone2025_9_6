import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@/app/trpc/routers/_app";

export type PlaylistGetManyOutput =
  inferRouterOutputs<AppRouter>["playlists"]["getMany"];
