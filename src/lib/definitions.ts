export type Novel = {
    id: string;
    novel_name: string;
    author_id: string;
    status: 'ongoing' | 'completed' | 'draft';
    date_created: string;
}