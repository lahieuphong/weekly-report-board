import type { DaySection } from "@/lib/weeks";
import {
  SHEET_GRID_TEMPLATE,
  SHEET_HEADER_BG,
  SHEET_HEADER_BORDER_COLOR,
  SHEET_LETTER_BG,
  SHEET_MIN_WIDTH,
  SHEET_ROW_HEIGHT,
  SHEET_TASK_BORDER_COLOR,
  createHorizontalGridBackground,
} from "@/lib/sheet-grid";

type Props = {
  days: DaySection[];
  startDate: string;
};

const START_MINUTES = 8 * 60;
const END_MINUTES = 19 * 60;
const SLOT_MINUTES = 30;

function toMinutes(value: string) {
  const [hour, minute] = value.split(":").map(Number);
  return hour * 60 + minute;
}

function getGridRow(start?: string, end?: string) {
  if (!start || !end) return null;

  const startRow = Math.max(
    1,
    Math.floor((toMinutes(start) - START_MINUTES) / SLOT_MINUTES) + 1
  );
  const endRow = Math.max(
    startRow + 1,
    Math.ceil((toMinutes(end) - START_MINUTES) / SLOT_MINUTES) + 1
  );

  return `${startRow} / ${endRow}`;
}

const slots = Array.from(
  { length: (END_MINUTES - START_MINUTES) / SLOT_MINUTES },
  (_, i) => {
    const total = START_MINUTES + i * SLOT_MINUTES;
    const hour = String(Math.floor(total / 60)).padStart(2, "0");
    const minute = String(total % 60).padStart(2, "0");
    return `${hour}:${minute}`;
  }
);

function getColumnLetter(index: number) {
  return String.fromCharCode(65 + index);
}

function getDateLabels(startDate: string, totalDays: number) {
  const base = new Date(startDate);

  if (Number.isNaN(base.getTime())) {
    return Array.from({ length: totalDays }, () => "");
  }

  return Array.from({ length: totalDays }, (_, index) => {
    const date = new Date(base);
    date.setDate(base.getDate() + index);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  });
}

export function ScheduleBoard({ days, startDate }: Props) {
  const columnLetters = Array.from(
    { length: days.length + 1 },
    (_, index) => getColumnLetter(index)
  );

  const dateLabels = getDateLabels(startDate, days.length);
  const bodyGridStyle = createHorizontalGridBackground();

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white">
      <div className="overflow-x-auto">
        <div
          style={{
            minWidth: SHEET_MIN_WIDTH,
            display: "grid",
            gridTemplateColumns: SHEET_GRID_TEMPLATE,
          }}
        >
          {columnLetters.map((letter, index) => (
            <div
              key={`letter-${letter}`}
              className="px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500"
              style={{
                background: SHEET_LETTER_BG,
                borderBottom: `1px solid ${SHEET_HEADER_BORDER_COLOR}`,
                borderRight:
                  index === columnLetters.length - 1
                    ? "none"
                    : `1px solid ${SHEET_HEADER_BORDER_COLOR}`,
              }}
            >
              {letter}
            </div>
          ))}

          <div
            className="px-3 py-2"
            style={{
              background: "#ffffff",
              borderBottom: `1px solid ${SHEET_HEADER_BORDER_COLOR}`,
              borderRight: `1px solid ${SHEET_HEADER_BORDER_COLOR}`,
            }}
          />

          {dateLabels.map((dateLabel, index) => (
            <div
              key={`date-${dateLabel}-${index}`}
              className="px-3 py-2 text-center text-[13px] font-medium text-slate-600"
              style={{
                background: "#ffffff",
                borderBottom: `1px solid ${SHEET_HEADER_BORDER_COLOR}`,
                borderRight:
                  index === dateLabels.length - 1
                    ? "none"
                    : `1px solid ${SHEET_HEADER_BORDER_COLOR}`,
              }}
            >
              {dateLabel}
            </div>
          ))}

          <div
            className="px-3 py-3 text-left text-[13px] font-semibold text-slate-800"
            style={{
              background: SHEET_HEADER_BG,
              borderBottom: `1px solid ${SHEET_HEADER_BORDER_COLOR}`,
              borderRight: `1px solid ${SHEET_HEADER_BORDER_COLOR}`,
            }}
          >
            Deadline
          </div>

          {days.map((day, index) => (
            <div
              key={`header-${day.label}-${index}`}
              className="px-3 py-2.5 text-center text-[13px] font-semibold uppercase text-slate-800"
              style={{
                background: SHEET_HEADER_BG,
                borderBottom: `1px solid ${SHEET_HEADER_BORDER_COLOR}`,
                borderRight:
                  index === days.length - 1
                    ? "none"
                    : `1px solid ${SHEET_HEADER_BORDER_COLOR}`,
              }}
            >
              {day.label}
            </div>
          ))}

          <div
            className="bg-slate-50"
            style={{
              display: "grid",
              gridTemplateRows: `repeat(${slots.length}, ${SHEET_ROW_HEIGHT}px)`,
              ...bodyGridStyle,
              borderRight: `1px solid ${SHEET_HEADER_BORDER_COLOR}`,
            }}
          >
            {slots.map((time) => (
              <div
                key={time}
                className="px-2 py-1.5 text-right text-[11px] font-medium text-slate-500"
              >
                {time}
              </div>
            ))}
          </div>

          {days.map((day, dayIndex) => {
            const timedItems = day.items.filter((item) => item.start && item.end);
            const looseItems = day.items.filter(
              (item) => !item.start || !item.end
            );

            return (
              <div
                key={`${day.label}-${dayIndex}`}
                className="relative bg-white"
                style={{
                  display: "grid",
                  gridTemplateRows: `repeat(${slots.length}, ${SHEET_ROW_HEIGHT}px)`,
                  ...bodyGridStyle,
                  borderRight:
                    dayIndex === days.length - 1
                      ? "none"
                      : `1px solid ${SHEET_HEADER_BORDER_COLOR}`,
                }}
              >
                {timedItems.map((item, index) => (
                  <div
                    key={`${item.title}-${index}`}
                    className="z-10 m-0.5 overflow-hidden border bg-slate-50/95 px-2 py-1 text-[12px] text-slate-800"
                    style={{
                      gridRow: getGridRow(item.start, item.end) ?? undefined,
                      borderColor: SHEET_TASK_BORDER_COLOR,
                    }}
                  >
                    <div className="whitespace-pre-wrap font-medium leading-4">
                      {item.title}
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500">
                      {item.start} - {item.end}
                    </div>
                  </div>
                ))}

                {looseItems.length > 0 ? (
                  <div
                    className="z-10 m-0.5 border border-dashed bg-slate-50/95 px-2 py-2 text-[12px] text-slate-700"
                    style={{
                      gridRow: `${slots.length - 2} / ${slots.length + 1}`,
                      borderColor: SHEET_TASK_BORDER_COLOR,
                    }}
                  >
                    <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Không cố định giờ
                    </div>

                    <div className="space-y-1.5">
                      {looseItems.map((item, index) => (
                        <div
                          key={`${item.title}-loose-${index}`}
                          className="border bg-white px-2 py-1.5 text-[12px] text-slate-800"
                          style={{
                            borderColor: SHEET_TASK_BORDER_COLOR,
                          }}
                        >
                          {item.title}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}