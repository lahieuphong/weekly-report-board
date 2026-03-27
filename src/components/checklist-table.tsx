import type { TaskItem } from "@/lib/weeks";
import clsx from "clsx";

type Props = {
  items: TaskItem[];
};

export function ChecklistTable({ items }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-emerald-800 text-white">
            <tr>
              <th className="border-b border-emerald-900 px-4 py-3 text-left font-semibold">
                Ngày
              </th>
              <th className="border-b border-emerald-900 px-4 py-3 text-left font-semibold">
                Khung giờ
              </th>
              <th className="border-b border-emerald-900 px-4 py-3 text-left font-semibold">
                Mô tả công việc
              </th>
              <th className="border-b border-emerald-900 px-4 py-3 text-left font-semibold">
                Trạng thái
              </th>
              <th className="border-b border-emerald-900 px-4 py-3 text-left font-semibold">
                Người thực hiện
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, index) => (
              <tr
                key={`${item.day}-${item.title}-${index}`}
                className={clsx(
                  "border-t border-slate-200",
                  index % 2 === 0 ? "bg-white" : "bg-slate-50/60"
                )}
              >
                <td className="px-4 py-3 text-slate-600">{item.day}</td>
                <td className="px-4 py-3 text-slate-600">
                  {item.start && item.end
                    ? `${item.start} - ${item.end}`
                    : "Không cố định"}
                </td>
                <td className="px-4 py-3 text-slate-900">{item.title}</td>
                <td className="px-4 py-3">
                  <span
                    className={clsx(
                      "badge",
                      item.checked ? "badge-done" : "badge-pending"
                    )}
                  >
                    {item.checked ? "Đã hoàn thành" : "Chưa hoàn thành"}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-700">Phong</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}