export const SHEET_TIME_COLUMN_WIDTH = 84;
export const SHEET_DAY_COLUMN_MIN_WIDTH = 170;
export const SHEET_TOTAL_COLUMNS = 8; // 1 cột thời gian + 7 cột ngày
export const SHEET_ROW_HEIGHT = 24;
export const SHEET_INFO_ROWS = 7;

export const SHEET_MIN_WIDTH =
  SHEET_TIME_COLUMN_WIDTH + SHEET_DAY_COLUMN_MIN_WIDTH * 7;

export const SHEET_GRID_TEMPLATE = `${SHEET_TIME_COLUMN_WIDTH}px repeat(7, minmax(${SHEET_DAY_COLUMN_MIN_WIDTH}px, 1fr))`;

export const SHEET_GRID_LINE_COLOR = "rgba(148, 163, 184, 0.18)";
export const SHEET_HEADER_BORDER_COLOR = "rgba(148, 163, 184, 0.28)";
export const SHEET_HEADER_BG = "#f8fafc";
export const SHEET_LETTER_BG = "#f1f5f9";
export const SHEET_TASK_BORDER_COLOR = "rgba(148, 163, 184, 0.28)";

export function createHorizontalGridBackground() {
  return {
    backgroundImage: `repeating-linear-gradient(
      to bottom,
      transparent 0,
      transparent ${SHEET_ROW_HEIGHT - 1}px,
      ${SHEET_GRID_LINE_COLOR} ${SHEET_ROW_HEIGHT - 1}px,
      ${SHEET_GRID_LINE_COLOR} ${SHEET_ROW_HEIGHT}px
    )`,
  };
}