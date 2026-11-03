import "dotenv/config";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { novelsTable } from "@/lib/database/schema";
import { toNovelRow } from "@/lib/database/transformers/novel-transformer";
import { novels } from "@/lib/placeholder-data";

async function main() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const db = drizzle(pool);

    try {
        await db
            .insert(novelsTable)
            .values(novels.map(toNovelRow))
            .onConflictDoNothing();

        const rows = await db.select().from(novelsTable);
        console.log(
            `seeded: ${novels.length} source rows, ${rows.length} in table`,
        );
    } finally {
        await pool.end();
    }
}

main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
});
