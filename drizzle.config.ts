import { defineConfig , Config } from "drizzle-kit";
import * as dotenv from 'dotenv'

dotenv.config({
  path:'.env.local'
})

export default defineConfig({
  schema: "./server/schema.ts",
  out: "./server/migrations",
  dialect: "postgresql",
  // driver: "pglite",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
  verbose: true,
  strict: true,
}) satisfies Config;
