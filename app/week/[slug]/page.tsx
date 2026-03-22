import Link from "next/link";
import { ChecklistTable } from "@/components/checklist-table";
import { MarkdownBlock } from "@/components/markdown-block";
import { ScheduleBoard } from "@/components/schedule-board";
import { StatCard } from "@/components/stat-card";
import { getAllWeekSlugs, getWeekBySlug } from "@/lib/weeks";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const slugs = await getAllWeekSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function WeekDetailPage({ params }: Props) {
  const { slug } = await params;
  const week = await getWeekBySlug(slug);

  return (
    <main className="container-page space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/"
            className="text-sm font-medium text-emerald-700 hover:underline"
          >
            ← Quay về danh sách tuần
          </Link>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            {week.title}
          </h1>
          <div className="mt-2 text-slate-500">
            {week.owner} • {week.weekLabel}
          </div>
        </div>

        <div className="rounded-2xl bg-emerald-700 px-5 py-4 text-white">
          <div className="text-sm text-emerald-100">Tiến độ tuần</div>
          <div className="mt-1 text-3xl font-bold">{week.progress}%</div>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Tổng task" value={week.totalCount} />
        <StatCard label="Đã xong" value={week.doneCount} />
        <StatCard
          label="Chưa xong"
          value={week.totalCount - week.doneCount}
        />
        <StatCard label="Nhân sự" value={week.owner} />
      </section>

      <section className="surface p-6">
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

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">
          Checklist tổng hợp
        </h2>
        <ChecklistTable items={week.checklist} />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <div className="surface p-6">
          <h2 className="text-xl font-bold text-slate-900">Kết quả</h2>
          <div className="mt-4">
            <MarkdownBlock content={week.resultMarkdown} />
          </div>
        </div>

        <div className="surface p-6">
          <h2 className="text-xl font-bold text-slate-900">Blocker</h2>
          <div className="mt-4">
            <MarkdownBlock content={week.blockerMarkdown} />
          </div>
        </div>
      </section>
    </main>
  );
}