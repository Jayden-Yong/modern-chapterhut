import { NovelStatus } from "@/lib/constants/novel-status";

export type Novel = {
    id: string;
    novel_name: string;
    author_id: string;
    status: NovelStatus;
    date_created: string;
};
