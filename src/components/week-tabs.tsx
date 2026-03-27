import Link from "next/link";

type Props = {
  slug: string;
};

export function WeekTabs({ slug }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href={`/week/${slug}`}
        className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
      >
        Tuần
      </Link>

      <Link
        href={`/week/${slug}/checklist`}
        className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
      >
        Checklist
      </Link>
    </div>
  );
}