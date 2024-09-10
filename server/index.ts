import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/server/schema";


// const sql = neon(process.env.POSTGRES_URL!);
const sql = neon(
  "postgresql://neondb_owner:gjFo1BVW3XUa@ep-crimson-feather-a190in1b-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
);
export const db = drizzle(sql, { schema, logger: true });
