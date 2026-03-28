import Image from "next/image";
import Link from "next/link";
import type { WeekReport } from "@/lib/weeks";

type Props = {
  week: WeekReport;
};

function AppIcon() {
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 shadow-sm">
      <div className="grid grid-cols-2 gap-0.5">
        <span className="block h-1.5 w-1.5 rounded-[1px] bg-white" />
        <span className="block h-1.5 w-1.5 rounded-[1px] bg-white" />
        <span className="block h-1.5 w-1.5 rounded-[1px] bg-white" />
        <span className="block h-1.5 w-1.5 rounded-[1px] bg-white" />
      </div>
    </div>
  );
}

function IconButton({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
    >
      {children}
    </button>
  );
}

export function WeekTopbar({ week }: Props) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="border-b border-slate-100 bg-slate-50/80">
        <div className="mx-auto flex max-w-360 items-center px-4 py-3 md:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50 hover:text-emerald-800"
          >
            <span className="text-base leading-none">←</span>
            <span>Quay về danh sách tuần</span>
          </Link>
        </div>
      </div>

      <div className="mx-auto flex min-h-19 max-w-360 items-center justify-between gap-4 px-4 py-3 md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <AppIcon />

          <div className="min-w-0">
            <div className="truncate text-[20px] font-semibold leading-6 text-slate-900">
              {week.documentTitle}
            </div>
            <div className="mt-1 truncate text-sm text-slate-500">
              {week.owner} • {week.weekLabel}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1 md:gap-2">
          <div className="hidden items-center gap-1 md:flex">
            <IconButton label="History">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M3 12a9 9 0 1 0 3-6.7" />
                <path d="M3 4v5h5" />
                <path d="M12 7v6l4 2" />
              </svg>
            </IconButton>

            <IconButton label="Comment">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M4 5h16v10H8l-4 4V5Z" />
              </svg>
            </IconButton>

            <IconButton label="Star">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9L12 3Z" />
              </svg>
            </IconButton>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-900 transition hover:bg-sky-200"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="12" cy="12" r="8" />
              <path d="M4 12h16" />
              <path d="M12 4a13 13 0 0 1 0 16" />
              <path d="M12 4a13 13 0 0 0 0 16" />
            </svg>
            <span className="hidden sm:inline">Chia sẻ</span>
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          <div className="overflow-hidden rounded-full ring-2 ring-white shadow-sm">
            <Image
              src="/avatar/lahieuphong.png"
              alt={week.owner}
              width={40}
              height={40}
              className="h-10 w-10 object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </header>
  );
}