import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./src/lib/database/schema.ts",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url:
            process.env.DIRECT_URL ??
            process.env.DATABASE_URL ??
            "postgres://localhost:5432/chapterhut",
    },
});