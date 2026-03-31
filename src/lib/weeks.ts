import fs from "fs/promises";
import path from "path";
import type { Dirent } from "fs";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content", "weeks");

export const DAY_LABELS = [
  "Thứ hai",
  "Thứ ba",
  "Thứ tư",
  "Thứ năm",
  "Thứ sáu",
  "Thứ bảy",
  "Chủ nhật",
] as const;

export type DayLabel = (typeof DAY_LABELS)[number];

export type TaskItem = {
  checked: boolean;
  title: string;
  day: DayLabel;
  start?: string;
  end?: string;
};

export type DaySection = {
  label: DayLabel;
  markdown: string;
  noteMarkdown: string;
  items: TaskItem[];
};

export type WeekReport = {
  slug: string;
  title: string;
  owner: string;
  teamName: string;
  ownerGiven: string;
  documentTitle: string;
  weekLabel: string;
  startDate: string;
  endDate: string;
  reportYear: number;
  reportMonth: number;
  reportWeekOfMonth: number;
  resultMarkdown: string;
  blockerMarkdown: string;
  days: DaySection[];
  checklist: TaskItem[];
  doneCount: number;
  totalCount: number;
  progress: number;
};

type Frontmatter = {
  slug?: unknown;
  ownerPrefix?: unknown;
  ownerGiven?: unknown;
  teamName?: unknown;
  startDate?: unknown;
  endDate?: unknown;
  reportYear?: unknown;
  reportMonth?: unknown;
  reportWeekOfMonth?: unknown;
};

function normalizeDate(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return String(value ?? "").trim();
}

function toDisplayDate(value: string): string {
  if (!value) return "";

  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const [, year, month, day] = match;
    return `${day}/${month}/${year}`;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function buildWeekLabel(startDate: string, endDate: string): string {
  const start = toDisplayDate(startDate);
  const end = toDisplayDate(endDate);

  if (start && end) return `${start} - ${end}`;
  return start || end;
}

function buildWeekTitle(params: {
  reportWeekOfMonth: number;
  reportMonth: number;
  reportYear: number;
}): string {
  const { reportWeekOfMonth, reportMonth, reportYear } = params;

  const week = reportWeekOfMonth > 0 ? reportWeekOfMonth : "";
  const month = reportMonth > 0 ? reportMonth : "";
  const year = reportYear > 0 ? reportYear : "";

  return `Tuần ${week} tháng ${month} năm ${year}`.replace(/\s+/g, " ").trim();
}

function toText(value: unknown): string {
  return String(value ?? "").trim();
}

function toDateValue(value: string): number {
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function toPositiveInt(value: unknown): number {
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? Math.floor(num) : 0;
}

function getWeekOfMonthFromDate(dateString: string): number {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return 0;
  }

  return Math.ceil(date.getDate() / 7);
}

function inferSlugFromPath(filePath: string): string {
  return path.basename(filePath, ".md");
}

function inferOwnerGiven(ownerPrefix: string, value: unknown): string {
  const givenName = toText(value);

  if (givenName) {
    return givenName;
  }

  const parts = ownerPrefix.split(/\s+/).filter(Boolean);
  return parts[parts.length - 1] ?? ownerPrefix;
}

function buildDocumentTitle(params: {
  title: string;
  teamName: string;
  ownerGiven: string;
}): string {
  const { title, teamName, ownerGiven } = params;

  const normalizedTitle = title.startsWith("Báo cáo ")
    ? title
    : `Báo cáo ${title}`;

  return [normalizedTitle, teamName, ownerGiven]
    .filter(Boolean)
    .join(" - ");
}

function inferCalendarMeta(params: {
  filePath: string;
  slug: string;
  startDate: string;
  meta: Frontmatter;
}): {
  reportYear: number;
  reportMonth: number;
  reportWeekOfMonth: number;
} {
  const { filePath, slug, startDate, meta } = params;

  let reportYear = toPositiveInt(meta.reportYear);
  let reportMonth = toPositiveInt(meta.reportMonth);
  let reportWeekOfMonth = toPositiveInt(meta.reportWeekOfMonth);

  const slugMatch = slug.match(/^(\d{4})-m(\d{2})-w(\d{2})$/);

  if (slugMatch) {
    if (!reportYear) reportYear = Number(slugMatch[1]);
    if (!reportMonth) reportMonth = Number(slugMatch[2]);
    if (!reportWeekOfMonth) reportWeekOfMonth = Number(slugMatch[3]);
  }

  const relativePath = path.relative(CONTENT_DIR, filePath);
  const pathParts = relativePath.split(path.sep);

  if (pathParts.length >= 3) {
    const yearFromPath = Number(pathParts[0]);
    const monthFromPath = Number(pathParts[1]);

    if (!reportYear && Number.isFinite(yearFromPath)) {
      reportYear = yearFromPath;
    }

    if (!reportMonth && Number.isFinite(monthFromPath)) {
      reportMonth = monthFromPath;
    }
  }

  if ((!reportYear || !reportMonth) && startDate) {
    const date = new Date(startDate);

    if (!Number.isNaN(date.getTime())) {
      if (!reportYear) reportYear = date.getFullYear();
      if (!reportMonth) reportMonth = date.getMonth() + 1;
    }
  }

  if (!reportWeekOfMonth && startDate) {
    reportWeekOfMonth = getWeekOfMonthFromDate(startDate);
  }

  return {
    reportYear,
    reportMonth,
    reportWeekOfMonth,
  };
}

function splitSections(markdown: string): Map<string, string> {
  const lines = markdown.split(/\r?\n/);
  const sections = new Map<string, string>();
  let current = "__root__";
  let buffer: string[] = [];

  const flush = (): void => {
    sections.set(current, buffer.join("\n").trim());
    buffer = [];
  };

  for (const line of lines) {
    if (line.startsWith("## ")) {
      flush();
      current = line.replace(/^##\s+/, "").trim();
      continue;
    }

    buffer.push(line);
  }

  flush();
  return sections;
}

function parseTaskLine(line: string, day: DayLabel): TaskItem | null {
  const regex =
    /^-\s\[(x|X| )\]\s*(?:(\d{1,2}:\d{2})-(\d{1,2}:\d{2})\s*\|\s*)?(.*)$/;
  const match = line.match(regex);

  if (!match) return null;

  const [, checkedRaw, start, end, title] = match;

  return {
    checked: checkedRaw.toLowerCase() === "x",
    start,
    end,
    title: title.trim(),
    day,
  };
}

function parseDaySection(label: DayLabel, markdown: string): DaySection {
  const lines = markdown.split(/\r?\n/);
  const items: TaskItem[] = [];
  const noteLines: string[] = [];

  for (const line of lines) {
    const task = parseTaskLine(line.trim(), label);

    if (task) {
      items.push(task);
    } else {
      noteLines.push(line);
    }
  }

  return {
    label,
    markdown,
    noteMarkdown: noteLines.join("\n").trim(),
    items,
  };
}

async function getMarkdownFiles(dir: string): Promise<string[]> {
  const entries: Dirent[] = await fs.readdir(dir, { withFileTypes: true });

  const results = await Promise.all(
    entries.map(async (entry: Dirent): Promise<string[]> => {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        return getMarkdownFiles(fullPath);
      }

      if (
        entry.isFile() &&
        entry.name.endsWith(".md") &&
        !entry.name.startsWith("_")
      ) {
        return [fullPath];
      }

      return [];
    })
  );

  return results.flat();
}

async function readWeekFile(fullPath: string): Promise<WeekReport> {
  const raw = await fs.readFile(fullPath, "utf-8");
  const { data, content } = matter(raw);
  const meta = data as Frontmatter;

  const sections = splitSections(content);

  const slug = toText(meta.slug) || inferSlugFromPath(fullPath);
  const ownerPrefix = toText(meta.ownerPrefix);
  const teamName = toText(meta.teamName);
  const ownerGiven = inferOwnerGiven(ownerPrefix, meta.ownerGiven);
  const owner = [ownerPrefix, ownerGiven].filter(Boolean).join(" ").trim();

  const startDate = normalizeDate(meta.startDate);
  const endDate = normalizeDate(meta.endDate);
  const weekLabel = buildWeekLabel(startDate, endDate);

  const { reportYear, reportMonth, reportWeekOfMonth } = inferCalendarMeta({
    filePath: fullPath,
    slug,
    startDate,
    meta,
  });
  const title =
    buildWeekTitle({
      reportWeekOfMonth,
      reportMonth,
      reportYear,
    });
  const documentTitle = buildDocumentTitle({
    title,
    teamName,
    ownerGiven,
  });

  const days: DaySection[] = DAY_LABELS.map((label) =>
    parseDaySection(label, sections.get(label) ?? "")
  );

  const checklist = days.flatMap((day) => day.items);
  const doneCount = checklist.filter((item) => item.checked).length;
  const totalCount = checklist.length;
  const progress =
    totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100);

  return {
    slug,
    title,
    owner,
    teamName,
    ownerGiven,
    documentTitle,
    weekLabel,
    startDate,
    endDate,
    reportYear,
    reportMonth,
    reportWeekOfMonth,
    resultMarkdown: sections.get("Feedback") ?? sections.get("Kết quả") ?? "",
    blockerMarkdown: sections.get("Solution") ?? sections.get("Blocker") ?? "",
    days,
    checklist,
    doneCount,
    totalCount,
    progress,
  };
}

export async function getAllWeeks(): Promise<WeekReport[]> {
  const markdownFiles = await getMarkdownFiles(CONTENT_DIR);
  const reports = await Promise.all(markdownFiles.map(readWeekFile));

  return reports.sort(
    (a, b) => toDateValue(b.startDate) - toDateValue(a.startDate)
  );
}

export async function getWeekBySlug(slug: string): Promise<WeekReport> {
  const all = await getAllWeeks();
  const found = all.find((item) => item.slug === slug);

  if (!found) {
    throw new Error(`Không tìm thấy tuần với slug: ${slug}`);
  }

  return found;
}

export async function getAllWeekSlugs(): Promise<string[]> {
  const all = await getAllWeeks();
  return all.map((item) => item.slug);
}