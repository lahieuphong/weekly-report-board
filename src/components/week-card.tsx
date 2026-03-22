import Link from "next/link";
import type { WeekReport } from "@/lib/weeks";

type Props = {
  week: WeekReport;
};

export function WeekCard({ week }: Props) {
  return (
    <Link
      href={`/week/${week.slug}`}
      className="surface block p-5 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-lg font-semibold text-slate-900">
            {week.title}
          </div>
          <div className="mt-1 text-sm text-slate-500">
            {week.owner} • {week.weekLabel}
          </div>
        </div>
        <span className="badge badge-done">{week.progress}%</span>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-emerald-500"
          style={{ width: `${week.progress}%` }}
        />
      </div>

      <div className="mt-4 text-sm text-slate-600">
        {week.doneCount}/{week.totalCount} công việc đã hoàn thành
      </div>
    </Link>
  );
}