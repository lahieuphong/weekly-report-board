import type { WeekReport } from "@/lib/weeks";
import { StatCard } from "@/components/stat-card";

type Props = {
  week: WeekReport;
};

export function WeekHeader({ week }: Props) {
  return (
    <section className="space-y-4">
      <div className="overflow-hidden rounded-[28px] bg-emerald-700 text-white">
        <div className="grid gap-6 p-6 md:grid-cols-[1.5fr_1fr] md:p-8">
          <div>
            <div className="text-sm uppercase tracking-[0.24em] text-emerald-100">
              Weekly Report Board
            </div>
            <h1 className="mt-3 text-3xl font-bold md:text-4xl">
              {week.title}
            </h1>
            <div className="mt-3 text-sm text-emerald-50">
              {week.owner} • {week.weekLabel}
            </div>
          </div>

          <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
            <div className="text-sm text-emerald-100">Tiến độ tuần</div>
            <div className="mt-1 text-4xl font-bold">{week.progress}%</div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white"
                style={{ width: `${week.progress}%` }}
              />
            </div>
            <div className="mt-3 text-sm text-emerald-50">
              {week.doneCount}/{week.totalCount} task hoàn thành
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Tổng task" value={week.totalCount} />
        <StatCard label="Đã xong" value={week.doneCount} />
        <StatCard label="Chưa xong" value={week.totalCount - week.doneCount} />
        <StatCard label="Nhân sự" value={week.owner} />
      </div>
    </section>
  );
}