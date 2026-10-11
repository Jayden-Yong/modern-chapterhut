import type { Novel } from "@/lib/models/novel";
import type { NovelRepository } from "@/lib/contracts/novel-repository";
import { novels } from "@/lib/placeholder-data";

export class Novels implements NovelRepository {
    async findAll(): Promise<Novel[]> {
        return novels.map((novel) => ({ ...novel }));
    }

    async findById(id: string): Promise<Novel | null> {
        const novel = novels.find((candidate) => candidate.id === id);
        return novel ? { ...novel } : null;
    }

    async findByAuthor(authorId: string): Promise<Novel[]> {
        return novels
            .filter((novel) => novel.author_id === authorId)
            .map((novel) => ({ ...novel }));
    }
}