import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";

dayjs.extend(customParseFormat);

export const formatDate = (date) => dayjs(date).toISOString();

export function trimKeys(obj) {
  const result = {};
  for (const key of Object.keys(obj)) {
    result[key.trim()] = obj[key];
  }
  return result;
}

export function parseDate(value) {
  if (!value) return null;
  const d = dayjs(value);
  if (d.isValid()) return d.toDate();
  const d2 = dayjs(value, ["DD/MM/YYYY", "DD-MM-YYYY"], null, true);
  if (d2.isValid()) return d2.toDate();
  return null;
}

