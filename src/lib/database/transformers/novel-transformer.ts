import { NovelRow } from "@/lib/database/schema";
import { Novel } from "@/lib/models/novel";

export function toNovel(row: NovelRow): Novel {
    return {
        id: row.id,
        novel_name: row.novelName,
        author_id: row.authorId,
        status: row.status,
        date_created: row.dateCreated,
    };
}

export function toNovelRow(novel: Novel): NovelRow {
    return {
        id: novel.id,
        novelName: novel.novel_name,
        authorId: novel.author_id,
        status: novel.status,
        dateCreated: novel.date_created,
    };
}

export function toNovels(rows: NovelRow[]): Novel[] {
    return rows.map(toNovel);
}