import type { WeekReport } from "@/lib/weeks";
import { ScheduleBoard } from "@/components/schedule-board";
import { WeekFeedbackSolution } from "@/components/week-feedback-solution";
import { WeekSheetHeader } from "@/components/week-sheet-header";

type Props = {
  week: WeekReport;
};

export function ReportSheet({ week }: Props) {
  return (
    <div className="space-y-6">
      <WeekSheetHeader week={week} />

      <ScheduleBoard days={week.days} startDate={week.startDate} />

      <WeekFeedbackSolution
        feedbackMarkdown={week.resultMarkdown}
        solutionMarkdown={week.blockerMarkdown}
      />
    </div>
  );
}