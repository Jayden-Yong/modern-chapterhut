CREATE TYPE "public"."novel_status" AS ENUM('ongoing', 'completed', 'draft');--> statement-breakpoint
CREATE TABLE "novels" (
	"id" text PRIMARY KEY NOT NULL,
	"novel_name" text NOT NULL,
	"author_id" text NOT NULL,
	"status" "novel_status" NOT NULL,
	"date_created" date NOT NULL
);
