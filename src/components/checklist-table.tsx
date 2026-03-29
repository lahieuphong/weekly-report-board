import type { TaskItem } from "@/lib/weeks";
import clsx from "clsx";
import {
  SHEET_DAY_COLUMN_MIN_WIDTH,
  SHEET_GRID_LINE_COLOR,
  SHEET_HEADER_BG,
  SHEET_HEADER_BORDER_COLOR,
  SHEET_ROW_HEIGHT,
  SHEET_TIME_COLUMN_WIDTH,
} from "@/lib/sheet-grid";

type Props = {
  items: TaskItem[];
  ownerShortName: string;
};

const CHECKLIST_MIN_WIDTH =
  SHEET_TIME_COLUMN_WIDTH + SHEET_DAY_COLUMN_MIN_WIDTH * 7;

const HEADER_ROW_HEIGHT = 46;

function StatusChip({ checked }: { checked: boolean }) {
  return (
    <span
      className={clsx(
        "mx-auto inline-flex h-6 min-w-32 items-center justify-center rounded-full border px-3 text-center text-[11px] font-semibold leading-none",
        "bg-emerald-50/80 text-emerald-700"
      )}
      style={{
        borderColor: "rgba(16, 185, 129, 0.22)",
      }}
    >
      {checked ? "Đã hoàn thành" : "Chưa hoàn thành"}
    </span>
  );
}

function getDayGroupSize(items: TaskItem[], startIndex: number) {
  const currentDay = items[startIndex]?.day;
  let count = 0;

  for (let i = startIndex; i < items.length; i += 1) {
    if (items[i].day !== currentDay) break;
    count += 1;
  }

  return count;
}

function getTimeGroupSize(items: TaskItem[], startIndex: number) {
  const currentDay = items[startIndex]?.day;
  const currentStart = items[startIndex]?.start ?? "";
  const currentEnd = items[startIndex]?.end ?? "";

  let count = 0;

  for (let i = startIndex; i < items.length; i += 1) {
    const item = items[i];
    const itemStart = item.start ?? "";
    const itemEnd = item.end ?? "";

    if (item.day !== currentDay) break;
    if (itemStart !== currentStart || itemEnd !== currentEnd) break;

    count += 1;
  }

  return count;
}

function isFirstDayRow(items: TaskItem[], index: number) {
  if (index === 0) return true;
  return items[index - 1].day !== items[index].day;
}

function isFirstTimeRow(items: TaskItem[], index: number) {
  if (index === 0) return true;

  const prev = items[index - 1];
  const current = items[index];

  return !(
    prev.day === current.day &&
    (prev.start ?? "") === (current.start ?? "") &&
    (prev.end ?? "") === (current.end ?? "")
  );
}

export function ChecklistTable({ items, ownerShortName }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white">
      <div className="sheet-scroll-frame sheet-scroll-frame-checklist">
        <table
          className="table-fixed border-collapse text-[13px] text-slate-700"
          style={{ minWidth: CHECKLIST_MIN_WIDTH, width: "100%" }}
        >
          <colgroup>
            <col style={{ width: SHEET_TIME_COLUMN_WIDTH }} />
            <col style={{ width: SHEET_DAY_COLUMN_MIN_WIDTH }} />
            <col style={{ width: SHEET_DAY_COLUMN_MIN_WIDTH }} />
            <col style={{ width: SHEET_DAY_COLUMN_MIN_WIDTH }} />
            <col style={{ width: SHEET_DAY_COLUMN_MIN_WIDTH }} />
            <col style={{ width: SHEET_DAY_COLUMN_MIN_WIDTH }} />
            <col style={{ width: SHEET_DAY_COLUMN_MIN_WIDTH }} />
            <col style={{ width: SHEET_DAY_COLUMN_MIN_WIDTH }} />
          </colgroup>

          <thead>
            <tr className="text-[13px] font-semibold text-slate-800">
              <th
                colSpan={2}
                className="px-4 py-3 text-center"
                style={{
                  height: HEADER_ROW_HEIGHT,
                  border: `1px solid ${SHEET_HEADER_BORDER_COLOR}`,
                  background: SHEET_HEADER_BG,
                  position: "sticky",
                  top: 0,
                  zIndex: 40,
                }}
              >
                Ngày
              </th>

              <th
                className="px-4 py-3 text-center"
                style={{
                  height: HEADER_ROW_HEIGHT,
                  border: `1px solid ${SHEET_HEADER_BORDER_COLOR}`,
                  background: SHEET_HEADER_BG,
                  position: "sticky",
                  top: 0,
                  zIndex: 40,
                }}
              >
                Khung giờ
              </th>

              <th
                colSpan={3}
                className="px-4 py-3 text-center"
                style={{
                  height: HEADER_ROW_HEIGHT,
                  border: `1px solid ${SHEET_HEADER_BORDER_COLOR}`,
                  background: SHEET_HEADER_BG,
                  position: "sticky",
                  top: 0,
                  zIndex: 40,
                }}
              >
                Mô tả công việc
              </th>

              <th
                className="px-4 py-3 text-center"
                style={{
                  height: HEADER_ROW_HEIGHT,
                  border: `1px solid ${SHEET_HEADER_BORDER_COLOR}`,
                  background: SHEET_HEADER_BG,
                  position: "sticky",
                  top: 0,
                  zIndex: 40,
                }}
              >
                Trạng thái
              </th>

              <th
                className="px-4 py-3 text-center"
                style={{
                  height: HEADER_ROW_HEIGHT,
                  border: `1px solid ${SHEET_HEADER_BORDER_COLOR}`,
                  background: SHEET_HEADER_BG,
                  position: "sticky",
                  top: 0,
                  zIndex: 40,
                }}
              >
                Người thực hiện
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, index) => {
              const renderDayCell = isFirstDayRow(items, index);
              const renderTimeCell = isFirstTimeRow(items, index);

              const dayRowSpan = renderDayCell
                ? getDayGroupSize(items, index)
                : undefined;

              const timeRowSpan = renderTimeCell
                ? getTimeGroupSize(items, index)
                : undefined;

              return (
                <tr
                  key={`${item.day}-${item.title}-${index}`}
                  className="transition hover:bg-slate-50/70"
                  style={{ height: SHEET_ROW_HEIGHT }}
                >
                  {renderDayCell ? (
                    <td
                      colSpan={2}
                      rowSpan={dayRowSpan}
                      className="px-3 py-0 align-middle"
                      style={{
                        border: `1px solid ${SHEET_GRID_LINE_COLOR}`,
                      }}
                    >
                      <div className="truncate text-center text-[12px] font-medium leading-5 text-slate-700">
                        {item.day.toUpperCase()}
                      </div>
                    </td>
                  ) : null}

                  {renderTimeCell ? (
                    <td
                      rowSpan={timeRowSpan}
                      className="px-2.5 py-0 align-middle"
                      style={{
                        border: `1px solid ${SHEET_GRID_LINE_COLOR}`,
                      }}
                    >
                      <div className="truncate text-center leading-5 text-slate-600">
                        {item.start && item.end
                          ? `${item.start} - ${item.end}`
                          : "Không cố định"}
                      </div>
                    </td>
                  ) : null}

                  <td
                    colSpan={3}
                    className="px-3 py-0 align-middle"
                    style={{
                      border: `1px solid ${SHEET_GRID_LINE_COLOR}`,
                      height: SHEET_ROW_HEIGHT,
                    }}
                  >
                    <div className="truncate text-left leading-5 text-slate-900">
                      - {item.title}
                    </div>
                  </td>

                  <td
                    className="px-2 py-0 align-middle text-center"
                    style={{
                      border: `1px solid ${SHEET_GRID_LINE_COLOR}`,
                      height: SHEET_ROW_HEIGHT,
                    }}
                  >
                    <StatusChip checked={item.checked} />
                  </td>

                  <td
                    className="px-2.5 py-0 align-middle"
                    style={{
                      border: `1px solid ${SHEET_GRID_LINE_COLOR}`,
                      height: SHEET_ROW_HEIGHT,
                    }}
                  >
                    <div className="truncate text-center leading-5 text-slate-700">
                      {ownerShortName}
                    </div>
                  </td>
                </tr>
              );
            })}

            {Array.from({ length: Math.max(0, 8 - items.length) }).map(
              (_, extraIndex) => (
                <tr
                  key={`empty-${extraIndex}`}
                  style={{ height: SHEET_ROW_HEIGHT }}
                >
                  <td
                    colSpan={2}
                    style={{
                      border: `1px solid ${SHEET_GRID_LINE_COLOR}`,
                      height: SHEET_ROW_HEIGHT,
                    }}
                  ></td>

                  <td
                    style={{
                      border: `1px solid ${SHEET_GRID_LINE_COLOR}`,
                      height: SHEET_ROW_HEIGHT,
                    }}
                  ></td>

                  <td
                    colSpan={3}
                    style={{
                      border: `1px solid ${SHEET_GRID_LINE_COLOR}`,
                      height: SHEET_ROW_HEIGHT,
                    }}
                  ></td>

                  <td
                    style={{
                      border: `1px solid ${SHEET_GRID_LINE_COLOR}`,
                      height: SHEET_ROW_HEIGHT,
                    }}
                  ></td>

                  <td
                    style={{
                      border: `1px solid ${SHEET_GRID_LINE_COLOR}`,
                      height: SHEET_ROW_HEIGHT,
                    }}
                  ></td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}