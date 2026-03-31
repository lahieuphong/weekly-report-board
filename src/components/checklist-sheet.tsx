import type { WeekReport } from "@/lib/weeks";
import { ChecklistTable } from "@/components/checklist-table";
import { WeekFeedbackSolution } from "@/components/week-feedback-solution";
import { WeekSheetHeader } from "@/components/week-sheet-header";

type Props = {
  week: WeekReport;
};

export function ChecklistSheet({ week }: Props) {
  return (
    <div className="space-y-6">
      <WeekSheetHeader week={week} />

      <ChecklistTable
        items={week.checklist}
        ownerGiven={week.ownerGiven}
      />

      <WeekFeedbackSolution
        feedbackMarkdown={week.resultMarkdown}
        solutionMarkdown={week.blockerMarkdown}
      />
    </div>
  );
}
