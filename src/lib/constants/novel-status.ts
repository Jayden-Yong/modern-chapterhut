export const NOVEL_STATUS_VALUES = ["ongoing", "completed", "draft"] as const;

export type NovelStatus = (typeof NOVEL_STATUS_VALUES)[number];