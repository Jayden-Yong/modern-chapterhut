export type NovelStatus = 'ongoing' | 'completed' | 'draft';

export type Novel = {
    id: string;
    novel_name: string;
    author_id: string;
    status: NovelStatus;
    date_created: string;
};
