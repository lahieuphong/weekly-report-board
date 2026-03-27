import type { WeekReport } from "@/lib/weeks";
import { MarkdownBlock } from "@/components/markdown-block";
import { ScheduleBoard } from "@/components/schedule-board";

type Props = {
  week: WeekReport;
};

export function ReportSheet({ week }: Props) {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-bold text-slate-900">Tóm tắt tuần</h2>
        <div className="mt-4">
          <MarkdownBlock content={week.summaryMarkdown} />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">
          Lịch công việc theo tuần
        </h2>
        <ScheduleBoard days={week.days} />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold text-slate-900">Kết quả</h2>
          <div className="mt-4">
            <MarkdownBlock content={week.resultMarkdown} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold text-slate-900">Blocker</h2>
          <div className="mt-4">
            <MarkdownBlock content={week.blockerMarkdown} />
          </div>
        </div>
      </section>
    </div>
  );
}