export const formatDate = (date) => {
  const d = new Date(date);
  return d.toISOString().replace(/\.\d{3}Z$/, "+00:00"); 
};

export function trimKeys(obj) {
  const result = {};
  for (const key of Object.keys(obj)) {
    result[key.trim()] = obj[key];
  }
  return result;
}

export function parseDate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (!isNaN(d.getTime())) return d;
  const parts = value.split("/");
  if (parts.length === 3) {
    const d2 = new Date(+parts[2], +parts[1] - 1, +parts[0]);
    if (!isNaN(d2.getTime())) return d2;
  }
  const parts2 = value.split("-");
  if (parts2.length === 3) {
    const monthIdx = +parts2[0] - 1;
    const day = +parts2[1];
    const year = +parts2[2];
    const d3 = new Date(year, monthIdx, day);
    if (!isNaN(d3.getTime()) && d3.getMonth() === monthIdx) return d3;
  }
  return null;
}

const ROW_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function colLetter(n) {
  let s = "";
  n++;
  while (n > 0) {
    n--;
    s = ROW_LETTERS[n % 26] + s;
    n = Math.floor(n / 26);
  }
  return s;
}