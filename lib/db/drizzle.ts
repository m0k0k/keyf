import { config } from "dotenv";
import { drizzle as neonDrizzle } from "drizzle-orm/neon-http";
import { drizzle as pgDrizzle } from "drizzle-orm/node-postgres";

config({ path: ".env" }); // or .env.local

const isProduction = process.env.NODE_ENV === "production";
export const db = isProduction
  ? neonDrizzle(process.env.DATABASE_URL!)
  : pgDrizzle(process.env.DATABASE_URL!);

// export const db = pgDrizzle(process.env.DATABASE_URL!);
// export const db = neonDrizzle(process.env.DATABASE_URL!);
