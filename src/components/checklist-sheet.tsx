import type { WeekReport } from "@/lib/weeks";
import { ChecklistTable } from "@/components/checklist-table";

type Props = {
  week: WeekReport;
};

export function ChecklistSheet({ week }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Checklist tổng hợp</h2>
        <p className="mt-1 text-sm text-slate-500">
          Danh sách task của {week.title}
        </p>
      </div>

      <ChecklistTable items={week.checklist} />
    </div>
  );
}