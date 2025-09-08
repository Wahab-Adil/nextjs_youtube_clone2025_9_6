import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
console.log("v", process.env.DATABASE_URL);
config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
