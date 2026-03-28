"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

type Props = {
  slug: string;
  reportWeekOfMonth: number;
  reportMonth: number;
  reportYear: number;
};

const BASE_PATH =
  process.env.NODE_ENV === "production" ? "/weekly-report-board" : "";

function padMonth(value: number) {
  return String(value).padStart(2, "0");
}

export function WeekTabs({
  slug,
  reportWeekOfMonth,
  reportMonth,
  reportYear,
}: Props) {
  const pathname = usePathname();
  const monthText = padMonth(reportMonth);

  const tabs = [
    {
      label: `Tuần ${reportWeekOfMonth} ${monthText}/${reportYear}`,
      href: `/week/${slug}`,
    },
    {
      label: `Checklist Tuần ${reportWeekOfMonth} ${monthText}/${reportYear}`,
      href: `/week/${slug}/checklist`,
    },
  ];

  return (
    <footer className="fixed inset-x-0 bottom-0 z-60 border-t border-slate-300 bg-[#f1f3f4]">
      <div className="mx-auto flex h-11.5 max-w-360 items-end overflow-x-auto px-0">
        <div className="flex min-w-max items-end">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={clsx(
                  "inline-flex h-8 items-center gap-1 border-r border-slate-300 px-4 text-[12px] font-medium leading-none transition first:border-l",
                  isActive
                    ? "bg-[#d2e3fc] text-[#0b57d0]"
                    : "bg-[#f1f3f4] text-[#3c4043] hover:bg-[#e8eaed]"
                )}
              >
                <span className="whitespace-nowrap">{tab.label}</span>

                <img
                  src={`${BASE_PATH}/icon/tab-caret.png`}
                  alt=""
                  width={10}
                  height={10}
                  className={clsx(
                    "h-2.5 w-2.5 object-contain",
                    isActive ? "opacity-100" : "opacity-70"
                  )}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </footer>
  );
}