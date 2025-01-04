import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./app/db/schema.ts",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
  tablesFilter: ["doc-search_*"],
});
