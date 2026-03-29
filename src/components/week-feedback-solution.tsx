import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  SHEET_GRID_LINE_COLOR,
  SHEET_HEADER_BORDER_COLOR,
  SHEET_INFO_ROWS,
  SHEET_MIN_WIDTH,
  SHEET_ROW_HEIGHT,
  SHEET_TOTAL_COLUMNS,
  SHEET_GRID_TEMPLATE,
} from "@/lib/sheet-grid";

type Props = {
  feedbackMarkdown: string;
  solutionMarkdown: string;
};

const FEEDBACK_FRAME_HEIGHT = 260;
const BOTTOM_BAR_HEIGHT = 22;

function estimateMarkdownRows(content: string) {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return 4;
  }

  const estimatedWrappedRows = lines.reduce((total, line) => {
    const normalized = line.replace(/^[-*]\s+/, "").trim();
    const wraps = Math.max(1, Math.ceil(normalized.length / 42));
    return total + wraps;
  }, 0);

  return Math.max(4, estimatedWrappedRows + 1);
}

function getMinimumRowsToFillFrame() {
  return Math.ceil(
    (FEEDBACK_FRAME_HEIGHT - BOTTOM_BAR_HEIGHT) / SHEET_ROW_HEIGHT
  );
}

function SheetMarkdown({ content }: { content: string }) {
  if (!content.trim()) return null;

  return (
    <div className="w-full text-[13px] text-slate-700">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => (
            <h2 className="min-h-6 text-[13px] font-semibold leading-6 text-slate-900">
              {children}
            </h2>
          ),
          p: ({ children }) => (
            <p className="min-h-6 text-[13px] leading-6">{children}</p>
          ),
          ul: ({ children }) => <ul className="m-0 pl-7">{children}</ul>,
          li: ({ children }) => (
            <li className="min-h-6 list-disc text-[13px] leading-6">
              {children}
            </li>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-slate-900">
              {children}
            </strong>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export function WeekFeedbackSolution({
  feedbackMarkdown,
  solutionMarkdown,
}: Props) {
  const feedbackRows = estimateMarkdownRows(feedbackMarkdown);
  const solutionRows = estimateMarkdownRows(solutionMarkdown);

  const contentRows = Math.max(feedbackRows, solutionRows);
  const minRowsToFillFrame = getMinimumRowsToFillFrame();

  const totalRows = Math.max(
    SHEET_INFO_ROWS,
    2 + contentRows + 1,
    minRowsToFillFrame
  );

  const cells = Array.from({
    length: totalRows * SHEET_TOTAL_COLUMNS,
  });

  const gridRows = `repeat(${totalRows}, ${SHEET_ROW_HEIGHT}px) ${BOTTOM_BAR_HEIGHT}px`;
  const gridHeight = totalRows * SHEET_ROW_HEIGHT + BOTTOM_BAR_HEIGHT;
  const contentGridRow = `3 / ${totalRows + 1}`;
  const bottomBarGridRow = `${totalRows + 1} / ${totalRows + 2}`;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-300 bg-white">
      <div className="sheet-scroll-frame sheet-scroll-frame-feedback">
        <div
          className="relative"
          style={{
            minWidth: SHEET_MIN_WIDTH,
            height: gridHeight,
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 grid"
            style={{
              gridTemplateColumns: SHEET_GRID_TEMPLATE,
              gridTemplateRows: gridRows,
            }}
          >
            {cells.map((_, index) => {
              const colIndex = index % SHEET_TOTAL_COLUMNS;
              const rowIndex = Math.floor(index / SHEET_TOTAL_COLUMNS);

              return (
                <div
                  key={`feedback-bg-cell-${index}`}
                  style={{
                    borderRight:
                      colIndex === SHEET_TOTAL_COLUMNS - 1
                        ? "none"
                        : `1px solid ${SHEET_GRID_LINE_COLOR}`,
                    borderBottom:
                      rowIndex === totalRows - 1
                        ? "none"
                        : `1px solid ${SHEET_GRID_LINE_COLOR}`,
                  }}
                />
              );
            })}

            <div
              className="col-span-full"
              style={{
                gridRow: bottomBarGridRow,
                background: "#0f9f57",
                borderTop: `1px solid ${SHEET_HEADER_BORDER_COLOR}`,
              }}
            />
          </div>

          <div
            className="relative z-10 grid"
            style={{
              gridTemplateColumns: SHEET_GRID_TEMPLATE,
              gridTemplateRows: gridRows,
            }}
          >
            <div
              className="flex h-full items-center px-6 text-[15px] font-bold text-emerald-600"
              style={{ gridColumn: "1 / 5", gridRow: "2 / 3" }}
            >
              Feedback:
            </div>

            <div
              className="flex h-full items-center px-6 text-[15px] font-bold text-emerald-600"
              style={{ gridColumn: "5 / 9", gridRow: "2 / 3" }}
            >
              Solution:
            </div>

            <div
              className="h-full px-6 py-0 text-slate-700"
              style={{
                gridColumn: "1 / 5",
                gridRow: contentGridRow,
              }}
            >
              <div className="flex h-full items-start">
                <SheetMarkdown content={feedbackMarkdown} />
              </div>
            </div>

            <div
              className="h-full px-6 py-0 text-slate-700"
              style={{
                gridColumn: "5 / 9",
                gridRow: contentGridRow,
              }}
            >
              <div className="flex h-full items-start">
                <SheetMarkdown content={solutionMarkdown} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}