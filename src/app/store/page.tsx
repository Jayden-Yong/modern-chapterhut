import { getNovelRepository } from "@/lib/repositories";

// The novels repository reads Postgres, so this route must render per request.
// Without this the build would need a reachable database, and CI's build job
// (which runs with no DATABASE_URL) would fail.
export const dynamic = "force-dynamic";

export default async function Page() {
    const novels = await getNovelRepository().findAll();

    return (
        <div className="font-poppins space-y-4">
            <h1 className="font-lusitana text-2xl md:text-4xl font-bold text-foreground">
                Chapterhut Store
            </h1>
            <ul className="space-y-3">
                {novels.map((novel) => (
                    <li
                        key={novel.id}
                        className="rounded-md border border-border bg-surface p-4"
                    >
                        <div className="flex items-center justify-between gap-4">
                            <span className="font-lusitana text-lg font-bold text-foreground">
                                {novel.novel_name}
                            </span>
                            <span className="text-xs uppercase tracking-wide text-muted">
                                {novel.status}
                            </span>
                        </div>
                        <p className="text-xs md:text-sm text-muted">
                            {novel.id} · {novel.author_id} ·{" "}
                            {novel.date_created}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
