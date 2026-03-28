import { MarkdownBlock } from "@/components/markdown-block";
import {
  SHEET_GRID_LINE_COLOR,
  SHEET_HEADER_BORDER_COLOR,
  SHEET_INFO_ROWS,
  SHEET_MIN_WIDTH,
  SHEET_ROW_HEIGHT,
  SHEET_TASK_BORDER_COLOR,
  SHEET_TOTAL_COLUMNS,
  SHEET_GRID_TEMPLATE,
} from "@/lib/sheet-grid";

type Props = {
  feedbackMarkdown: string;
  solutionMarkdown: string;
};

export function WeekFeedbackSolution({
  feedbackMarkdown,
  solutionMarkdown,
}: Props) {
  const cells = Array.from({
    length: SHEET_INFO_ROWS * SHEET_TOTAL_COLUMNS,
  });

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-300 bg-white">
      <div className="overflow-x-auto">
        <div style={{ minWidth: SHEET_MIN_WIDTH }}>
          <div
            className="relative grid"
            style={{
              gridTemplateColumns: SHEET_GRID_TEMPLATE,
              gridTemplateRows: `repeat(${SHEET_INFO_ROWS}, ${SHEET_ROW_HEIGHT}px) 22px`,
            }}
          >
            {cells.map((_, index) => {
              const colIndex = index % SHEET_TOTAL_COLUMNS;
              const rowIndex = Math.floor(index / SHEET_TOTAL_COLUMNS);

              return (
                <div
                  key={`feedback-cell-${index}`}
                  style={{
                    borderRight:
                      colIndex === SHEET_TOTAL_COLUMNS - 1
                        ? "none"
                        : `1px solid ${SHEET_GRID_LINE_COLOR}`,
                    borderBottom:
                      rowIndex === SHEET_INFO_ROWS - 1
                        ? "none"
                        : `1px solid ${SHEET_GRID_LINE_COLOR}`,
                  }}
                />
              );
            })}

            <div
              className="z-10 px-6 pt-2 text-[15px] font-bold text-emerald-600"
              style={{ gridColumn: "1 / 5", gridRow: "2 / 3" }}
            >
              Feedback:
            </div>

            <div
              className="z-10 px-6 pt-2 text-[15px] font-bold text-emerald-600"
              style={{ gridColumn: "5 / 9", gridRow: "2 / 3" }}
            >
              Solution:
            </div>

            <div
              className="z-10 px-6 py-1 text-slate-700"
              style={{
                gridColumn: "1 / 5",
                gridRow: "3 / 7",
              }}
            >
              <MarkdownBlock content={feedbackMarkdown} />
            </div>

            <div
              className="z-10 px-6 py-1 text-slate-700"
              style={{
                gridColumn: "5 / 9",
                gridRow: "3 / 7",
              }}
            >
              <MarkdownBlock content={solutionMarkdown} />
            </div>

            <div
              className="col-span-full"
              style={{
                gridRow: `${SHEET_INFO_ROWS + 1} / ${SHEET_INFO_ROWS + 2}`,
                background: "#0f9f57",
                borderTop: `1px solid ${SHEET_HEADER_BORDER_COLOR}`,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}