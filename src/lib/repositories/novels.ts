import type { Novel } from "@/lib/models/novel";
import type { NovelRepository } from "@/lib/contracts/novel-repository";
import { asc, eq } from "drizzle-orm";
import { novelsTable } from "@/lib/database/schema";
import { toNovel, toNovels } from "@/lib/database/transformers/novel-transformer";
import { Database } from "@/lib/database/client";

export class Novels implements NovelRepository {
    constructor(
        private readonly db: Database
    ) {}

    /**
     * Gets all novels from database
     * 
     * @returns Novel[]
     */
    async findAll(): Promise<Novel[]> {
        /* get novel db objects from database and return novel model using transformer */
        const novelRows = await this.db.select().from(novelsTable).orderBy(asc(novelsTable.id))

        return toNovels(novelRows);
    }

    /**
     * Gets a novel by its identifier from database
     * 
     * @param identifier 
     * @returns Novel | null
     */
    async findById(identifier: string): Promise<Novel | null> {
        const novelRows = await this.db.select().from(novelsTable).where(eq(novelsTable.id, identifier)).limit(1);

        return novelRows[0] ? toNovel(novelRows[0]) : null;
    }

    /**
     * Gets novels by an authorId
     * 
     * @param authorId 
     * @returns 
     */
    async findByAuthor(authorId: string): Promise<Novel[]> {
        const novelRows = await this.db.select().from(novelsTable).where(eq(novelsTable.authorId, authorId));

        return toNovels(novelRows);
    }
}
