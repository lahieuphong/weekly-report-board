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

function normalizePath(path: string) {
  if (!path) return "/";

  let normalized = path;

  if (BASE_PATH && normalized.startsWith(BASE_PATH)) {
    normalized = normalized.slice(BASE_PATH.length) || "/";
  }

  if (normalized.length > 1 && normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }

  return normalized || "/";
}

function TabCaret({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={clsx(
        "h-4 w-4 shrink-0 transition-colors duration-150",
        active ? "text-[#137333]" : "text-[#5f6368]"
      )}
      fill="currentColor"
    >
      <path d="M7 10l5 5 5-5H7z" />
    </svg>
  );
}

export function WeekTabs({
  slug,
  reportWeekOfMonth,
  reportMonth,
  reportYear,
}: Props) {
  const pathname = usePathname();
  const monthText = padMonth(reportMonth);
  const currentPath = normalizePath(pathname);

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
            const isActive = currentPath === normalizePath(tab.href);

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={clsx(
                  "relative inline-flex h-9 items-center gap-1.5 border-r border-slate-300 px-6 text-[12px] leading-none transition-all duration-150 first:border-l",
                  isActive
                    ? "bg-[#e6f4ea] text-[#137333] font-semibold"
                    : "bg-[#f1f3f4] text-[#3c4043] font-medium hover:bg-[#e6f4ea] hover:text-[#137333]"
                )}
              >
                <span className="whitespace-nowrap">{tab.label}</span>
                <TabCaret active={isActive} />

                <span
                  className={clsx(
                    "pointer-events-none absolute inset-x-0 bottom-0 h-0.5 transition-colors duration-150",
                    isActive ? "bg-[#137333]" : "bg-transparent"
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