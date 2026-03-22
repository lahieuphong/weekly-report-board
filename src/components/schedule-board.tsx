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
    <div className="surface overflow-hidden">
      <div className="overflow-x-auto">
        <div className="grid-sheet min-w-[1600px]">
          <div className="border-r border-b border-emerald-900 bg-emerald-700 px-4 py-3 text-sm font-semibold text-white">
            Khung giờ
          </div>

          {days.map((day) => (
            <div
              key={day.label}
              className="border-r border-b border-emerald-900 bg-emerald-700 px-4 py-3 text-white"
            >
              <div className="text-sm font-semibold">{day.label}</div>
            </div>
          ))}

          <div
            className="border-r bg-slate-50"
            style={{
              display: "grid",
              gridTemplateRows: `repeat(${slots.length}, 42px)`,
            }}
          >
            {slots.map((time) => (
              <div
                key={time}
                className="border-b border-slate-200 px-3 py-2 text-xs text-slate-500"
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
                className="border-r bg-white"
                style={{
                  display: "grid",
                  gridTemplateRows: `repeat(${slots.length}, 42px)`,
                }}
              >
                {slots.map((_, index) => (
                  <div key={index} className="border-b border-slate-100" />
                ))}

                {timedItems.map((item, index) => (
                  <div
                    key={`${item.title}-${index}`}
                    className="z-10 m-1 rounded-xl border border-emerald-200 bg-emerald-50 p-2 text-xs shadow-sm"
                    style={{ gridRow: getGridRow(item.start, item.end) ?? undefined }}
                  >
                    <div className="font-semibold text-emerald-900">
                      {item.title}
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500">
                      {item.start} - {item.end}
                    </div>
                  </div>
                ))}

                {looseItems.length > 0 ? (
                  <div
                    className="z-10 m-2 mt-auto self-end rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 text-xs"
                    style={{ gridRow: `${slots.length - 2} / ${slots.length + 1}` }}
                  >
                    <div className="mb-2 font-semibold text-slate-700">
                      Không cố định giờ
                    </div>
                    <div className="space-y-2">
                      {looseItems.map((item, index) => (
                        <div
                          key={`${item.title}-loose-${index}`}
                          className="rounded-md bg-white p-2"
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