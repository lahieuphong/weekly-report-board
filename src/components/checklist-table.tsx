import type { TaskItem } from "@/lib/weeks";
import clsx from "clsx";
import {
  SHEET_GRID_LINE_COLOR,
  SHEET_HEADER_BG,
  SHEET_HEADER_BORDER_COLOR,
  SHEET_LETTER_BG,
  SHEET_ROW_HEIGHT,
  SHEET_TASK_BORDER_COLOR,
} from "@/lib/sheet-grid";

type Props = {
  items: TaskItem[];
  ownerShortName: string;
};

const CHECKLIST_INDEX_COLUMN_WIDTH = 84;
const CHECKLIST_DAY_COLUMN_WIDTH = 140;
const CHECKLIST_TIME_COLUMN_WIDTH = 170;
const CHECKLIST_TASK_COLUMN_WIDTH = 520;
const CHECKLIST_STATUS_COLUMN_WIDTH = 170;
const CHECKLIST_OWNER_COLUMN_WIDTH = 150;

const CHECKLIST_MIN_WIDTH =
  CHECKLIST_INDEX_COLUMN_WIDTH +
  CHECKLIST_DAY_COLUMN_WIDTH +
  CHECKLIST_TIME_COLUMN_WIDTH +
  CHECKLIST_TASK_COLUMN_WIDTH +
  CHECKLIST_STATUS_COLUMN_WIDTH +
  CHECKLIST_OWNER_COLUMN_WIDTH;

export function ChecklistTable({ items, ownerShortName }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white">
      <div className="overflow-x-auto">
        <table
          className="table-fixed border-collapse text-[13px] text-slate-700"
          style={{ minWidth: CHECKLIST_MIN_WIDTH, width: "100%" }}
        >
          <colgroup>
            <col style={{ width: CHECKLIST_INDEX_COLUMN_WIDTH }} />
            <col style={{ width: CHECKLIST_DAY_COLUMN_WIDTH }} />
            <col style={{ width: CHECKLIST_TIME_COLUMN_WIDTH }} />
            <col style={{ width: CHECKLIST_TASK_COLUMN_WIDTH }} />
            <col style={{ width: CHECKLIST_STATUS_COLUMN_WIDTH }} />
            <col style={{ width: CHECKLIST_OWNER_COLUMN_WIDTH }} />
          </colgroup>

          <thead>
            <tr
              className="text-[11px] font-semibold uppercase tracking-wide text-slate-500"
              style={{ background: SHEET_LETTER_BG }}
            >
              <th
                className="px-3 py-2 text-center"
                style={{ border: `1px solid ${SHEET_HEADER_BORDER_COLOR}` }}
              ></th>
              <th
                className="px-3 py-2 text-center"
                style={{ border: `1px solid ${SHEET_HEADER_BORDER_COLOR}` }}
              >
                A
              </th>
              <th
                className="px-3 py-2 text-center"
                style={{ border: `1px solid ${SHEET_HEADER_BORDER_COLOR}` }}
              >
                B
              </th>
              <th
                className="px-3 py-2 text-center"
                style={{ border: `1px solid ${SHEET_HEADER_BORDER_COLOR}` }}
              >
                C
              </th>
              <th
                className="px-3 py-2 text-center"
                style={{ border: `1px solid ${SHEET_HEADER_BORDER_COLOR}` }}
              >
                D
              </th>
              <th
                className="px-3 py-2 text-center"
                style={{ border: `1px solid ${SHEET_HEADER_BORDER_COLOR}` }}
              >
                E
              </th>
            </tr>

            <tr
              className="text-[13px] font-semibold text-slate-800"
              style={{ background: SHEET_HEADER_BG }}
            >
              <th
                className="px-3 py-3 text-center"
                style={{
                  border: `1px solid ${SHEET_HEADER_BORDER_COLOR}`,
                  background: SHEET_LETTER_BG,
                }}
              >
                #
              </th>
              <th
                className="px-3 py-3 text-left"
                style={{ border: `1px solid ${SHEET_HEADER_BORDER_COLOR}` }}
              >
                Ngày
              </th>
              <th
                className="px-3 py-3 text-left"
                style={{ border: `1px solid ${SHEET_HEADER_BORDER_COLOR}` }}
              >
                Khung giờ
              </th>
              <th
                className="px-3 py-3 text-left"
                style={{ border: `1px solid ${SHEET_HEADER_BORDER_COLOR}` }}
              >
                Mô tả công việc
              </th>
              <th
                className="px-3 py-3 text-left"
                style={{ border: `1px solid ${SHEET_HEADER_BORDER_COLOR}` }}
              >
                Trạng thái
              </th>
              <th
                className="px-3 py-3 text-left"
                style={{ border: `1px solid ${SHEET_HEADER_BORDER_COLOR}` }}
              >
                Người thực hiện
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, index) => (
              <tr
                key={`${item.day}-${item.title}-${index}`}
                className="transition hover:bg-slate-50/70"
              >
                <td
                  className="px-3 py-2 text-center text-[12px] font-medium text-slate-500"
                  style={{
                    border: `1px solid ${SHEET_GRID_LINE_COLOR}`,
                    background: SHEET_LETTER_BG,
                    minHeight: SHEET_ROW_HEIGHT,
                  }}
                >
                  {index + 1}
                </td>

                <td
                  className="px-3 py-2 align-top text-slate-700"
                  style={{
                    border: `1px solid ${SHEET_GRID_LINE_COLOR}`,
                    minHeight: SHEET_ROW_HEIGHT,
                  }}
                >
                  {item.day}
                </td>

                <td
                  className="px-3 py-2 align-top text-slate-600"
                  style={{
                    border: `1px solid ${SHEET_GRID_LINE_COLOR}`,
                    minHeight: SHEET_ROW_HEIGHT,
                  }}
                >
                  {item.start && item.end
                    ? `${item.start} - ${item.end}`
                    : "Không cố định"}
                </td>

                <td
                  className="px-3 py-2 align-top text-slate-900"
                  style={{
                    border: `1px solid ${SHEET_GRID_LINE_COLOR}`,
                    minHeight: SHEET_ROW_HEIGHT,
                  }}
                >
                  <div className="whitespace-pre-wrap leading-6">{item.title}</div>
                </td>

                <td
                  className="px-3 py-2 align-top"
                  style={{
                    border: `1px solid ${SHEET_GRID_LINE_COLOR}`,
                    minHeight: SHEET_ROW_HEIGHT,
                  }}
                >
                  <span
                    className={clsx(
                      "inline-flex min-h-8 items-center rounded-md border px-3 py-1 text-[12px] font-medium",
                      item.checked
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    )}
                    style={{
                      borderColor: SHEET_TASK_BORDER_COLOR,
                    }}
                  >
                    {item.checked ? "Đã hoàn thành" : "Chưa hoàn thành"}
                  </span>
                </td>

                <td
                  className="px-3 py-2 align-top text-slate-700"
                  style={{
                    border: `1px solid ${SHEET_GRID_LINE_COLOR}`,
                    minHeight: SHEET_ROW_HEIGHT,
                  }}
                >
                  {ownerShortName}
                </td>
              </tr>
            ))}

            {Array.from({ length: Math.max(0, 8 - items.length) }).map(
              (_, extraIndex) => (
                <tr key={`empty-${extraIndex}`}>
                  <td
                    className="px-3 py-2 text-center text-[12px] text-slate-400"
                    style={{
                      border: `1px solid ${SHEET_GRID_LINE_COLOR}`,
                      background: SHEET_LETTER_BG,
                      height: SHEET_ROW_HEIGHT,
                    }}
                  >
                    {items.length + extraIndex + 1}
                  </td>
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