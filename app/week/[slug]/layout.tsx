import { notFound } from "next/navigation";
import { WeekTabs } from "@/components/week-tabs";
import { WeekTopbar } from "@/components/week-topbar";
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
    <>
      <WeekTopbar week={week} />

      <main className="container-page pb-44 pt-6 md:pb-48">
        <div className="mb-6 md:mb-8">
          <div className="surface overflow-hidden p-4 md:p-6">{children}</div>
        </div>
      </main>

      <WeekTabs
        slug={week.slug}
        reportWeekOfMonth={week.reportWeekOfMonth}
        reportMonth={week.reportMonth}
        reportYear={week.reportYear}
      />
    </>
  );
}