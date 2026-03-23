import type { QuarterRange, RelativeUnit } from './dateFilter.types';

export function getInitialUnit(): RelativeUnit {
  return 'years';
}

export function getInitialRange(initialValue?: string): { from: string; to: string } {
  if (initialValue === '1y') {
    return { from: 'last year', to: 'year to date' };
  }

  if (initialValue === '90d') {
    return { from: 'last quarter', to: 'this quarter' };
  }

  if (initialValue === '7d') {
    return { from: 'last week', to: 'this week' };
  }

  return { from: '2 months ago', to: 'this month' };
}

export function summarizeSelection(from: string, to: string) {
  return `${from} - ${to}`;
}

export function formatQuarterRange(range: QuarterRange) {
  if (
    !range.fromQuarter ||
    !range.fromYear ||
    !range.toQuarter ||
    !range.toYear
  ) {
    return '';
  }

  return `${range.fromQuarter} ${range.fromYear} - ${range.toQuarter} ${range.toYear}`;
}

export function titleCase(value: string) {
  return value.replace(/\b\w/g, (char) => char.toUpperCase());
}

export function buildTypedRelativeOptions(unit: RelativeUnit, query: string) {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return [];
  }

  const numberMatch = trimmed.match(/^(\d+)$/);
  if (numberMatch) {
    const amount = Number(numberMatch[1]);
    return [`${amount} ${unit} ago`, `${amount} ${unit} ahead`];
  }

  if (unit === 'days' && ['yesterday', 'today', 'tomorrow'].includes(trimmed)) {
    return [trimmed];
  }

  if (unit !== 'days' && ['last', 'this', 'next'].includes(trimmed)) {
    const singular = unit.slice(0, -1);
    return [`${trimmed} ${singular}`];
  }

  return [];
}
