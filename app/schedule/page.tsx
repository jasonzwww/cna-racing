import { ScheduleBoard, type ScheduleRace } from "@/components/ScheduleBoard";
import { registrations } from "@/data/registrations";
import { seriesCatalog } from "@/lib/series";

export default function SchedulePage() {
    const races: ScheduleRace[] = seriesCatalog.flatMap((series) =>
        series.races.map((race) => ({
            id: `${series.key}-${race.round}-${race.start}`,
            seriesKey: series.key,
            seriesName: series.seriesName,
            seasonName: series.seasonName,
            round: race.round,
            track: race.track,
            start: race.start,
            format: race.format,
            note: race.note,
        }))
    );

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
            <section className="mx-auto max-w-7xl px-6 py-12">
                <div>
                    <div className="text-xs tracking-widest text-zinc-400">CNA SCHEDULE</div>
                    <h1 className="mt-2 text-3xl md:text-5xl font-semibold tracking-tight">赛程总览</h1>
                    <p className="mt-2 text-zinc-300">
                        默认混合显示两个系列赛，可选择单独过滤。下一场赛事高亮显示，已结束赛事将自动变灰。
                    </p>
                </div>

                <div className="mt-10">
                    <ScheduleBoard series={seriesCatalog} races={races} registrations={registrations} />
                </div>
            </section>
        </main>
    );
}
