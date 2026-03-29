import type { WeekReport } from "@/lib/weeks";

type Props = {
  week: WeekReport;
};

export function WeekSheetHeader({ week }: Props) {
  return (
    <div className="-mx-4 -mt-4 mb-4 overflow-hidden border-b border-slate-300 md:-mx-6 md:-mt-6 md:mb-5">
      <div className="grid grid-cols-1 bg-emerald-600 text-white md:grid-cols-2">
        <div className="border-b border-emerald-700 px-4 py-2 md:border-b-0 md:border-r md:px-5">
          <div className="text-[14px] font-semibold leading-5 md:text-[16px]">
            Name: {week.owner}
          </div>
        </div>

        <div className="px-4 py-2 text-left md:px-5 md:text-right">
          <div className="text-[14px] font-semibold leading-5 md:text-[16px]">
            Title: {week.title}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[110px_1fr] bg-emerald-600 text-white">
        <div className="border-r border-t border-emerald-700 px-4 py-1.5 text-[13px] font-semibold md:px-5">
          Week of:
        </div>

        <div className="border-t border-emerald-700 px-4 py-1.5 text-[13px] md:px-5">
          <div className="md:hidden">
            <div className="font-medium leading-5">{week.weekLabel}</div>
            <div className="mt-1 italic leading-5">
              {week.doneCount}/{week.totalCount} completed
            </div>
          </div>

          <div className="hidden md:block font-medium">
            <span>{week.weekLabel}</span>
            <span className="ml-3 italic">
              {week.doneCount}/{week.totalCount} completed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}