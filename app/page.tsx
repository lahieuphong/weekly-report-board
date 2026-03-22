import { WeekCard } from "@/components/week-card";
import { getAllWeeks } from "@/lib/weeks";

export default async function HomePage() {
  const weeks = await getAllWeeks();
  const latest = weeks[0];

  return (
    <main className="container-page space-y-8">
      <section className="overflow-hidden rounded-[28px] bg-emerald-700 text-white">
        <div className="grid gap-6 p-8 md:grid-cols-[1.5fr_1fr]">
          <div>
            <div className="text-sm uppercase tracking-[0.24em] text-emerald-100">
              Weekly Report Board
            </div>
            <h1 className="mt-3 text-3xl font-bold md:text-4xl">
              Báo cáo tuần & checklist công việc
            </h1>
            <p className="mt-4 max-w-2xl text-emerald-50">
              Giao diện lấy cảm hứng từ Google Sheet nhưng gọn hơn, dễ nhìn hơn
              và chỉ cần cập nhật bằng file Markdown mỗi tuần.
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
            <div className="text-sm text-emerald-100">Tuần mới nhất</div>
            {latest ? (
              <>
                <div className="mt-2 text-xl font-semibold">{latest.title}</div>
                <div className="mt-1 text-sm text-emerald-50">
                  {latest.weekLabel}
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-white"
                    style={{ width: `${latest.progress}%` }}
                  />
                </div>
                <div className="mt-3 text-sm text-emerald-50">
                  {latest.doneCount}/{latest.totalCount} task hoàn thành
                </div>
              </>
            ) : null}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Danh sách các tuần
          </h2>
          <p className="mt-1 text-slate-500">
            Mỗi tuần là một file Markdown trong thư mục content/weeks
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {weeks.map((week) => (
            <WeekCard key={week.slug} week={week} />
          ))}
        </div>
      </section>
    </main>
  );
}