import { baseProcedure, createTRPCRouter } from "@/app/trpc/init";
import { db } from "@/db";
import { categories } from "@/db/schema";

export const categoriesRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    const data = await db.select().from(categories);
    return data;
  }),
});
