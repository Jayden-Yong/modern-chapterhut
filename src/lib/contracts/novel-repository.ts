import type { Novel } from '@/lib/models/novel';

export interface NovelRepository {
    findAll(): Promise<Novel[]>;
    findById(id: string): Promise<Novel | null>;
    findByAuthor(authorId: string): Promise<Novel[]>;
}