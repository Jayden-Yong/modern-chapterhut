import Image from "next/image";

interface HomeCardProps {
    imgPath: string;
    cardTitle: string;
    cardContent: string;
    invertOrder: boolean;
}

export default function HomeCard({ imgPath, cardTitle, cardContent, invertOrder }: HomeCardProps) {
    return (
        <div className="rounded-3xl bg-surface border border-border/50 shadow-md shadow-accent mt-6 md:mt-12 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-10 items-stretch">

                <div className={`col-span-1 md:col-span-3 ${(invertOrder) ? "" : "md:order-2"} p-6 md:p-8 flex items-center justify-center`}>
                    <div className="relative w-full h-48 md:h-64">
                        <Image
                            src={imgPath}
                            alt={cardTitle}
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>

                <div className={`col-span-1 md:col-span-7 ${(invertOrder) ? "" : "md:order-1"} flex flex-col space-y-3 text-left p-5 md:p-8 md:pr-4 justify-center`}>
                    <h3 className="font-lusitana text-lg md:text-3xl font-bold text-foreground tracking-tight leading-tight">
                        {cardTitle}
                    </h3>
                    <p className="font-poppins text-xs md:text-base font-normal text-muted leading-relaxed">
                        {cardContent}
                    </p>
                </div>
            </div>
        </div>
    );
}