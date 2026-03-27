import Link from "next/link";
import { notFound } from "next/navigation";
import { WeekHeader } from "@/components/week-header";
import { WeekTabs } from "@/components/week-tabs";
import { getAllWeekSlugs, getWeekBySlug } from "@/lib/weeks";

type Props = {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const slugs = await getAllWeekSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function WeekLayout({ children, params }: Props) {
  const { slug } = await params;

  let week;
  try {
    week = await getWeekBySlug(slug);
  } catch {
    notFound();
  }

  return (
    <main className="container-page pb-24">
      <div className="mb-6">
        <Link
          href="/"
          className="text-sm font-medium text-emerald-700 hover:underline"
        >
          ← Quay về danh sách tuần
        </Link>
      </div>

      <WeekHeader week={week} />

      <div className="mt-6">
        <div className="surface overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
            <WeekTabs slug={week.slug} />
          </div>

          <div className="p-4 md:p-6">{children}</div>
        </div>
      </div>
    </main>
  );
}