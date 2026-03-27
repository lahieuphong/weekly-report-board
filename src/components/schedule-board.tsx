import type { DaySection } from "@/lib/weeks";

type Props = {
  days: DaySection[];
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

export function ScheduleBoard({ days }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white">
      <div className="overflow-x-auto">
        <div className="grid-sheet min-w-[1200px]">
          <div className="border-r border-b border-slate-300 bg-slate-100 px-3 py-3 text-sm font-semibold text-slate-700">
            Deadline
          </div>

          {days.map((day) => (
            <div
              key={day.label}
              className="border-r border-b border-slate-300 bg-slate-100 px-3 py-3 text-center text-sm font-bold text-slate-800"
            >
              {day.label.toUpperCase()}
            </div>
          ))}

          <div
            className="border-r border-slate-300 bg-slate-50"
            style={{
              display: "grid",
              gridTemplateRows: `repeat(${slots.length}, 42px)`,
            }}
          >
            {slots.map((time) => (
              <div
                key={time}
                className="border-b border-slate-200 px-2 py-2 text-right text-xs text-slate-500"
              >
                {time}
              </div>
            ))}
          </div>

          {days.map((day) => {
            const timedItems = day.items.filter((item) => item.start && item.end);
            const looseItems = day.items.filter((item) => !item.start || !item.end);

            return (
              <div
                key={day.label}
                className="relative border-r border-slate-300 bg-white"
                style={{
                  display: "grid",
                  gridTemplateRows: `repeat(${slots.length}, 42px)`,
                }}
              >
                {slots.map((_, index) => (
                  <div key={index} className="border-b border-slate-200" />
                ))}

                {timedItems.map((item, index) => (
                  <div
                    key={`${item.title}-${index}`}
                    className="z-10 m-1 rounded-none border border-slate-400 bg-slate-50 p-2 text-xs shadow-none"
                    style={{ gridRow: getGridRow(item.start, item.end) ?? undefined }}
                  >
                    <div className="font-medium text-slate-900">{item.title}</div>
                    <div className="mt-1 text-[11px] text-slate-500">
                      {item.start} - {item.end}
                    </div>
                  </div>
                ))}

                {looseItems.length > 0 ? (
                  <div
                    className="z-10 m-1 rounded-none border border-dashed border-slate-400 bg-slate-50 p-2 text-xs"
                    style={{ gridRow: `${slots.length - 2} / ${slots.length + 1}` }}
                  >
                    <div className="mb-2 font-semibold text-slate-700">
                      Không cố định giờ
                    </div>
                    <div className="space-y-1">
                      {looseItems.map((item, index) => (
                        <div
                          key={`${item.title}-loose-${index}`}
                          className="border border-slate-200 bg-white p-2"
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