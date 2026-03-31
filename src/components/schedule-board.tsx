import type { DaySection } from "@/lib/weeks";
import {
  SHEET_GRID_TEMPLATE,
  SHEET_HEADER_BG,
  SHEET_HEADER_BORDER_COLOR,
  SHEET_MIN_WIDTH,
  SHEET_ROW_HEIGHT,
  SHEET_TASK_BORDER_COLOR,
  createHorizontalGridBackground,
} from "@/lib/sheet-grid";

type Props = {
  days: DaySection[];
  startDate: string;
};

type TimedItem = DaySection["items"][number] & {
  startMinutes: number;
  endMinutes: number;
};

type GroupedTimedItem = {
  start: string;
  end: string;
  startMinutes: number;
  endMinutes: number;
  titles: string[];
};

type TimedLayoutItem = GroupedTimedItem & {
  lane: number;
  laneCount: number;
  top: number;
  height: number;
};

const SLOT_MINUTES = 30;
const DEFAULT_START_MINUTES = 8 * 60;
const DEFAULT_END_MINUTES = 17 * 60;
const DAY_START_MINUTES = 0;
const DAY_END_MINUTES = 24 * 60;
const COMBINED_HEADER_ROW_HEIGHT = 36;

function toMinutes(value: string) {
  const [hour, minute] = value.split(":").map(Number);
  return hour * 60 + minute;
}

function formatTime(totalMinutes: number) {
  const clamped = Math.max(
    DAY_START_MINUTES,
    Math.min(totalMinutes, DAY_END_MINUTES)
  );

  const normalized = clamped % DAY_END_MINUTES;
  const hour = String(Math.floor(normalized / 60)).padStart(2, "0");
  const minute = String(normalized % 60).padStart(2, "0");

  return `${hour}:${minute}`;
}

function shouldShowHourLabel(totalMinutes: number) {
  return totalMinutes % 60 === 0;
}

function floorToHour(value: number) {
  return Math.floor(value / 60) * 60;
}

function ceilToHour(value: number) {
  return Math.ceil(value / 60) * 60;
}

function getVisibleRange(days: DaySection[]) {
  const timedItems = days.flatMap((day) =>
    day.items.filter((item) => item.start && item.end)
  );

  if (timedItems.length === 0) {
    return {
      startMinutes: DEFAULT_START_MINUTES,
      endMinutes: DEFAULT_END_MINUTES,
    };
  }

  const starts = timedItems.map((item) => toMinutes(item.start!));
  const ends = timedItems.map((item) => toMinutes(item.end!));

  let startMinutes = floorToHour(Math.min(...starts));
  let endMinutes = Math.max(
    DEFAULT_END_MINUTES,
    ceilToHour(Math.max(...ends))
  );

  startMinutes = Math.max(DAY_START_MINUTES, startMinutes);
  endMinutes = Math.min(DAY_END_MINUTES, endMinutes);

  if (endMinutes <= startMinutes) {
    endMinutes = Math.min(startMinutes + 60, DAY_END_MINUTES);
  }

  return {
    startMinutes,
    endMinutes,
  };
}

function getDateLabels(startDate: string, totalDays: number) {
  const base = new Date(startDate);

  if (Number.isNaN(base.getTime())) {
    return Array.from({ length: totalDays }, () => "");
  }

  return Array.from({ length: totalDays }, (_, index) => {
    const date = new Date(base);
    date.setDate(base.getDate() + index);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  });
}

function firstAvailableLane(usedLanes: number[]) {
  let lane = 0;

  while (usedLanes.includes(lane)) {
    lane += 1;
  }

  return lane;
}

function estimateWrappedLines(text: string, charsPerLine: number) {
  const normalized = text.replace(/\s+/g, " ").trim();

  if (!normalized) return 1;

  return Math.max(1, Math.ceil(normalized.length / charsPerLine));
}

function getEstimatedCharsPerLine(laneCount: number) {
  if (laneCount >= 4) return 10;
  if (laneCount === 3) return 14;
  if (laneCount === 2) return 22;
  return 32;
}

function estimateEventContentHeight(
  titles: string[],
  start: string,
  end: string,
  laneCount: number
) {
  const charsPerLine = getEstimatedCharsPerLine(laneCount);

  const titleLines = titles.reduce((total, title) => {
    return total + estimateWrappedLines(`- ${title}`, charsPerLine);
  }, 0);

  const titleGapHeight = Math.max(0, titles.length - 1) * 1;
  const titleBlockHeight = titleLines * 15 + titleGapHeight;

  const timeText = `${start} - ${end}`;
  const timeLines = estimateWrappedLines(timeText, Math.max(14, charsPerLine));
  const timeBlockHeight = timeLines * 14;

  const verticalPadding = 6;
  const gapBetweenTitleAndTime = 4;

  return (
    verticalPadding +
    titleBlockHeight +
    gapBetweenTitleAndTime +
    timeBlockHeight +
    verticalPadding
  );
}

function getEventTypographyDensity(
  estimatedContentHeight: number,
  visualHeight: number
) {
  const densityRatio =
    visualHeight > 0 ? estimatedContentHeight / visualHeight : 1;

  if (densityRatio >= 1.7) {
    return {
      titleFontSize: 9,
      titleLineHeight: 1.18,
      timeFontSize: 8,
      timeLineHeight: 1.12,
      paddingX: 6,
      paddingY: 3,
      titleTimeGap: 2,
      compact: true,
    };
  }

  if (densityRatio >= 1.3) {
    return {
      titleFontSize: 10,
      titleLineHeight: 1.22,
      timeFontSize: 9,
      timeLineHeight: 1.16,
      paddingX: 7,
      paddingY: 4,
      titleTimeGap: 3,
      compact: true,
    };
  }

  return {
    titleFontSize: 11,
    titleLineHeight: 1.28,
    timeFontSize: 10,
    timeLineHeight: 1.2,
    paddingX: 8,
    paddingY: 4,
    titleTimeGap: 4,
    compact: false,
  };
}

function buildTimedLayouts(
  items: DaySection["items"],
  visibleStartMinutes: number,
  visibleEndMinutes: number
): TimedLayoutItem[] {
  const normalized: TimedItem[] = items
    .filter((item) => item.start && item.end)
    .map((item) => {
      const rawStart = toMinutes(item.start!);
      const rawEnd = toMinutes(item.end!);

      const startMinutes = Math.max(
        visibleStartMinutes,
        Math.min(rawStart, visibleEndMinutes)
      );

      const endMinutes = Math.max(
        startMinutes + SLOT_MINUTES,
        Math.min(rawEnd, visibleEndMinutes)
      );

      return {
        ...item,
        startMinutes,
        endMinutes,
      };
    })
    .sort((a, b) => {
      if (a.startMinutes !== b.startMinutes) {
        return a.startMinutes - b.startMinutes;
      }

      if (a.endMinutes !== b.endMinutes) {
        return a.endMinutes - b.endMinutes;
      }

      return a.title.localeCompare(b.title);
    });

  if (normalized.length === 0) {
    return [];
  }

  const groupedMap = new Map<string, GroupedTimedItem>();

  for (const item of normalized) {
    const key = `${item.startMinutes}-${item.endMinutes}`;

    if (!groupedMap.has(key)) {
      groupedMap.set(key, {
        start: item.start!,
        end: item.end!,
        startMinutes: item.startMinutes,
        endMinutes: item.endMinutes,
        titles: [item.title],
      });
    } else {
      groupedMap.get(key)!.titles.push(item.title);
    }
  }

  const grouped = Array.from(groupedMap.values()).sort((a, b) => {
    if (a.startMinutes !== b.startMinutes) {
      return a.startMinutes - b.startMinutes;
    }

    if (a.endMinutes !== b.endMinutes) {
      return a.endMinutes - b.endMinutes;
    }

    return a.titles[0].localeCompare(b.titles[0]);
  });

  const groups: GroupedTimedItem[][] = [];
  let currentGroup: GroupedTimedItem[] = [];
  let currentGroupEnd = -1;

  for (const item of grouped) {
    if (currentGroup.length === 0) {
      currentGroup = [item];
      currentGroupEnd = item.endMinutes;
      continue;
    }

    if (item.startMinutes < currentGroupEnd) {
      currentGroup.push(item);
      currentGroupEnd = Math.max(currentGroupEnd, item.endMinutes);
      continue;
    }

    groups.push(currentGroup);
    currentGroup = [item];
    currentGroupEnd = item.endMinutes;
  }

  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  return groups.flatMap((group) => {
    const active: Array<{ lane: number; endMinutes: number }> = [];

    const assigned = group.map((item) => {
      for (let i = active.length - 1; i >= 0; i -= 1) {
        if (active[i].endMinutes <= item.startMinutes) {
          active.splice(i, 1);
        }
      }

      const usedLanes = active.map((entry) => entry.lane);
      const lane = firstAvailableLane(usedLanes);

      active.push({
        lane,
        endMinutes: item.endMinutes,
      });

      return {
        ...item,
        lane,
      };
    });

    const laneCount = Math.max(...assigned.map((item) => item.lane), 0) + 1;

    return assigned.map((item) => {
      const top =
        ((item.startMinutes - visibleStartMinutes) / SLOT_MINUTES) *
        SHEET_ROW_HEIGHT;

      const height = Math.max(
        SHEET_ROW_HEIGHT,
        ((item.endMinutes - item.startMinutes) / SLOT_MINUTES) *
          SHEET_ROW_HEIGHT
      );

      return {
        ...item,
        laneCount,
        top,
        height,
      };
    });
  });
}

export function ScheduleBoard({ days, startDate }: Props) {
  const dateLabels = getDateLabels(startDate, days.length);
  const bodyGridStyle = createHorizontalGridBackground();

  const { startMinutes: visibleStartMinutes, endMinutes: visibleEndMinutes } =
    getVisibleRange(days);

  const timelineRowCount =
    Math.floor((visibleEndMinutes - visibleStartMinutes) / SLOT_MINUTES) + 1;

  const bodyHeight = timelineRowCount * SHEET_ROW_HEIGHT;

  const timelineLabels = Array.from({ length: timelineRowCount }, (_, index) =>
    formatTime(visibleStartMinutes + index * SLOT_MINUTES)
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white">
      <div className="sheet-scroll-frame sheet-scroll-frame-schedule">
        <div
          style={{
            minWidth: SHEET_MIN_WIDTH,
            display: "grid",
            gridTemplateColumns: SHEET_GRID_TEMPLATE,
          }}
        >
          <div
            className="flex items-center px-6 text-left text-[13px] font-semibold text-slate-800"
            style={{
              height: COMBINED_HEADER_ROW_HEIGHT,
              background: SHEET_HEADER_BG,
              borderBottom: `1px solid ${SHEET_HEADER_BORDER_COLOR}`,
              borderRight: `1px solid ${SHEET_HEADER_BORDER_COLOR}`,
              position: "sticky",
              top: 0,
              zIndex: 40,
            }}
          >
            Deadline
          </div>

          {days.map((day, index) => (
            <div
              key={`header-${day.label}-${index}`}
              className="flex flex-col items-center justify-center gap-0 px-3 text-center"
              style={{
                height: COMBINED_HEADER_ROW_HEIGHT,
                background: SHEET_HEADER_BG,
                borderBottom: `1px solid ${SHEET_HEADER_BORDER_COLOR}`,
                borderRight:
                  index === days.length - 1
                    ? "none"
                    : `1px solid ${SHEET_HEADER_BORDER_COLOR}`,
                position: "sticky",
                top: 0,
                zIndex: 40,
              }}
            >
              <div className="text-[12px] font-semibold uppercase leading-none tracking-[0.01em] text-slate-800">
                {day.label}
              </div>
              <div className="mt-px text-[10px] font-medium leading-none text-slate-500">
                {dateLabels[index]}
              </div>
            </div>
          ))}

          <div
            className="grid bg-slate-50"
            style={{
              height: bodyHeight,
              gridTemplateRows: `repeat(${timelineRowCount}, ${SHEET_ROW_HEIGHT}px)`,
              ...bodyGridStyle,
              borderRight: `1px solid ${SHEET_HEADER_BORDER_COLOR}`,
            }}
          >
            {timelineLabels.map((label, index) => {
              const currentMinutes = visibleStartMinutes + index * SLOT_MINUTES;

              return (
                <div
                  key={`time-cell-${index}`}
                  className="flex items-center justify-end px-3 text-right text-[11px] font-medium text-slate-500"
                >
                  {shouldShowHourLabel(currentMinutes) ? label : ""}
                </div>
              );
            })}
          </div>

          {days.map((day, dayIndex) => {
            const timedLayouts = buildTimedLayouts(
              day.items,
              visibleStartMinutes,
              visibleEndMinutes
            );

            const looseItems = day.items.filter(
              (item) => !item.start || !item.end
            );

            return (
              <div
                key={`${day.label}-${dayIndex}`}
                className="relative bg-white"
                style={{
                  display: "grid",
                  gridTemplateRows: `repeat(${timelineRowCount}, ${SHEET_ROW_HEIGHT}px)`,
                  height: bodyHeight,
                  ...bodyGridStyle,
                  borderRight:
                    dayIndex === days.length - 1
                      ? "none"
                      : `1px solid ${SHEET_HEADER_BORDER_COLOR}`,
                }}
              >
                {timedLayouts.map((item, index) => {
                  const laneWidth = 100 / item.laneCount;
                  const leftPercent = laneWidth * item.lane;

                  const estimatedContentHeight = estimateEventContentHeight(
                    item.titles,
                    item.start,
                    item.end,
                    item.laneCount
                  );

                  const desiredHeight = Math.max(
                    item.height,
                    estimatedContentHeight
                  );
                  const visualHeight = Math.min(desiredHeight, bodyHeight);
                  const maxTop = Math.max(0, bodyHeight - visualHeight);
                  const visualTop = Math.min(item.top, maxTop);

                  const typography = getEventTypographyDensity(
                    estimatedContentHeight,
                    visualHeight
                  );

                  return (
                    <div
                      key={`${item.start}-${item.end}-${item.titles.join("|")}-${index}`}
                      className="absolute z-10 border bg-emerald-50/70 text-slate-800"
                      style={{
                        top: visualTop,
                        height: visualHeight,
                        left: `calc(${leftPercent}% + 2px)`,
                        width: `calc(${laneWidth}% - 4px)`,
                        borderColor: "rgba(16, 185, 129, 0.22)",
                        boxSizing: "border-box",
                        padding: `${typography.paddingY}px ${typography.paddingX}px`,
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <div
                        className="schedule-event-scroll min-h-0 flex-1 space-y-px"
                        style={{
                          overflowY: "auto",
                          overscrollBehavior: "contain",
                        }}
                      >
                        {item.titles.map((title, titleIndex) => (
                          <div
                            key={`${title}-${titleIndex}`}
                            className="font-medium"
                            style={{
                              fontSize: typography.titleFontSize,
                              lineHeight: typography.titleLineHeight,
                              overflowWrap: "anywhere",
                              wordBreak: "break-word",
                            }}
                          >
                            - {title}
                          </div>
                        ))}
                      </div>

                      <div
                        className="text-slate-500"
                        style={{
                          marginTop: typography.titleTimeGap,
                          fontSize: typography.timeFontSize,
                          lineHeight: typography.timeLineHeight,
                          overflowWrap: "anywhere",
                          wordBreak: "break-word",
                          textAlign: "right",
                          width: "100%",
                        }}
                      >
                        {item.start} - {item.end}
                      </div>
                    </div>
                  );
                })}

                {looseItems.length > 0 ? (
                  <div
                    className="z-10 m-0.5 border border-dashed bg-slate-50/95 px-2 py-2 text-[12px] text-slate-700"
                    style={{
                      gridRow: `${Math.max(1, timelineRowCount - 2)} / ${timelineRowCount + 1}`,
                      borderColor: SHEET_TASK_BORDER_COLOR,
                    }}
                  >
                    <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Không cố định giờ
                    </div>

                    <div className="space-y-1.5">
                      {looseItems.map((item, index) => (
                        <div
                          key={`${item.title}-loose-${index}`}
                          className="border bg-white px-2 py-1.5 text-[12px] text-slate-800"
                          style={{
                            borderColor: SHEET_TASK_BORDER_COLOR,
                          }}
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
