/** Normalize DD/MM/YYYY or YYYY-MM-DD to YYYY-MM-DD */
export function normalizeDateOfBirth(input = '') {
  const trimmed = String(input).trim();
  if (!trimmed) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  const slashMatch = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (slashMatch) {
    const [, dd, mm, yyyy] = slashMatch;
    return `${yyyy}-${mm}-${dd}`;
  }

  const dashMatch = trimmed.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (dashMatch) {
    const [, dd, mm, yyyy] = dashMatch;
    return `${yyyy}-${mm}-${dd}`;
  }

  return null;
}

export function isValidDateString(isoDate) {
  if (!isoDate) return false;
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return false;
  return isoDate === date.toISOString().slice(0, 10);
}
