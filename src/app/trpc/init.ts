import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { initTRPC, TRPCError } from "@trpc/server";
import { Redis } from "@upstash/redis";
import { cache } from "react";
import SuperJSON from "superjson";
import { eq } from "drizzle-orm";
export const createTRPCContext = cache(async () => {
  const { userId } = await auth();

  return { clerkUserId: userId };
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  transformer: SuperJSON,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const protectedProcedure = t.procedure.use(async function isAuthed(
  options
) {
  if (!options.ctx.clerkUserId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, options.ctx.clerkUserId))
    .limit(1);

  if (!user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return options.next({ ctx: { ...options, user } });
});
