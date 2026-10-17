import { date, text, pgEnum, pgTable } from "drizzle-orm/pg-core";
import { NOVEL_STATUS_VALUES } from "@/lib/constants/novel-status";

export const novelStatusEnum = pgEnum("novel_status", NOVEL_STATUS_VALUES);

export const novelsTable = pgTable("novels", {
    id: text("id").primaryKey(),
    novelName: text("novel_name").notNull(),
    authorId: text("author_id").notNull(),
    status: novelStatusEnum("status").notNull(),
    dateCreated: date("date_created").notNull(),
});

export type NovelRow = typeof novelsTable.$inferSelect;
