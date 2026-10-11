import { Novels } from "@/lib/repositories/novels";
import type { NovelRepository } from "@/lib/contracts/novel-repository";

let repository: NovelRepository | null = null;

export function getNovelRepository(): NovelRepository {
    if (repository === null) {
        repository = new Novels();
    }

    return repository;
}
