import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content", "weeks");

const DAY_LABELS = [
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
  weekLabel: string;
  startDate: string;
  endDate: string;
  summaryMarkdown: string;
  resultMarkdown: string;
  blockerMarkdown: string;
  days: DaySection[];
  checklist: TaskItem[];
  doneCount: number;
  totalCount: number;
  progress: number;
};

type Frontmatter = {
  slug: string;
  title: string;
  owner: string;
  weekLabel: string;
  startDate: unknown;
  endDate: unknown;
};

function normalizeDate(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return String(value ?? "");
}

function toDateValue(value: string): number {
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function splitSections(markdown: string) {
  const lines = markdown.split(/\r?\n/);
  const sections = new Map<string, string>();
  let current = "__root__";
  let buffer: string[] = [];

  const flush = () => {
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

async function readWeekFile(fileName: string): Promise<WeekReport> {
  const fullPath = path.join(CONTENT_DIR, fileName);
  const raw = await fs.readFile(fullPath, "utf-8");
  const { data, content } = matter(raw);
  const meta = data as Frontmatter;

  const sections = splitSections(content);

  const days = DAY_LABELS.map((label) =>
    parseDaySection(label, sections.get(label) ?? "")
  );

  const checklist = days.flatMap((day) => day.items);
  const doneCount = checklist.filter((item) => item.checked).length;
  const totalCount = checklist.length;
  const progress =
    totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100);

  return {
    slug: String(meta.slug ?? ""),
    title: String(meta.title ?? ""),
    owner: String(meta.owner ?? ""),
    weekLabel: String(meta.weekLabel ?? ""),
    startDate: normalizeDate(meta.startDate),
    endDate: normalizeDate(meta.endDate),
    summaryMarkdown: sections.get("Tóm tắt") ?? "",
    resultMarkdown: sections.get("Kết quả") ?? "",
    blockerMarkdown: sections.get("Blocker") ?? "",
    days,
    checklist,
    doneCount,
    totalCount,
    progress,
  };
}

export async function getAllWeeks() {
  const files = await fs.readdir(CONTENT_DIR);
  const markdownFiles = files.filter(
    (file) => file.endsWith(".md") && !file.startsWith("_")
  );
  const reports = await Promise.all(markdownFiles.map(readWeekFile));

  return reports.sort(
    (a, b) => toDateValue(b.startDate) - toDateValue(a.startDate)
  );
}

export async function getWeekBySlug(slug: string) {
  const all = await getAllWeeks();
  const found = all.find((item) => item.slug === slug);

  if (!found) {
    throw new Error(`Không tìm thấy tuần với slug: ${slug}`);
  }

  return found;
}

export async function getAllWeekSlugs() {
  const all = await getAllWeeks();
  return all.map((item) => item.slug);
}