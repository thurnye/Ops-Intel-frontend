import { DateTime } from 'luxon';
import type { DashboardDateFilterValue } from './dateFilter.types';

type ResolvedDateFilter = {
  mode: DashboardDateFilterValue['mode'];
  period: string;
  from: string;
  to: string;
};

function toIsoDate(value: DateTime) {
  return value.toISODate() ?? '';
}

function quarterStart(year: number, quarter: number) {
  return DateTime.local(year, quarter * 3 - 2, 1).startOf('quarter');
}

function quarterEnd(year: number, quarter: number) {
  return DateTime.local(year, quarter * 3 - 2, 1).endOf('quarter');
}

function shiftDate(
  value: DateTime,
  unit: 'days' | 'weeks' | 'months' | 'quarters' | 'years',
  amount: number,
) {
  if (unit === 'quarters') {
    return value.plus({ months: amount * 3 });
  }

  return value.plus({ [unit]: amount });
}

function startOfUnit(
  value: DateTime,
  unit: 'days' | 'weeks' | 'months' | 'quarters' | 'years',
) {
  if (unit === 'days') return value.startOf('day');
  if (unit === 'weeks') return value.startOf('week');
  if (unit === 'months') return value.startOf('month');
  if (unit === 'quarters') return value.startOf('quarter');
  return value.startOf('year');
}

function endOfUnit(
  value: DateTime,
  unit: 'days' | 'weeks' | 'months' | 'quarters' | 'years',
) {
  if (unit === 'days') return value.endOf('day');
  if (unit === 'weeks') return value.endOf('week');
  if (unit === 'months') return value.endOf('month');
  if (unit === 'quarters') return value.endOf('quarter');
  return value.endOf('year');
}

function parseQuarterPeriod(period: string) {
  const match = period.match(
    /^Q([1-4])\s+(\d{4})\s*-\s*Q([1-4])\s+(\d{4})$/i,
  );

  if (!match) {
    return null;
  }

  const [, fromQuarter, fromYear, toQuarter, toYear] = match;

  return {
    from: toIsoDate(quarterStart(Number(fromYear), Number(fromQuarter))),
    to: toIsoDate(quarterEnd(Number(toYear), Number(toQuarter))),
  };
}

function parseSimpleRelativeToken(token: string) {
  const trimmed = token.trim().toLowerCase();
  const now = DateTime.local();

  if (trimmed === 'today') {
    return { from: toIsoDate(now.startOf('day')), to: toIsoDate(now.endOf('day')) };
  }

  if (trimmed === 'yesterday') {
    const value = now.minus({ days: 1 });
    return { from: toIsoDate(value.startOf('day')), to: toIsoDate(value.endOf('day')) };
  }

  if (trimmed === 'tomorrow') {
    const value = now.plus({ days: 1 });
    return { from: toIsoDate(value.startOf('day')), to: toIsoDate(value.endOf('day')) };
  }

  if (trimmed === 'this week') {
    return { from: toIsoDate(now.startOf('week')), to: toIsoDate(now.endOf('week')) };
  }

  if (trimmed === 'last week') {
    const value = now.minus({ weeks: 1 });
    return { from: toIsoDate(value.startOf('week')), to: toIsoDate(value.endOf('week')) };
  }

  if (trimmed === 'next week') {
    const value = now.plus({ weeks: 1 });
    return { from: toIsoDate(value.startOf('week')), to: toIsoDate(value.endOf('week')) };
  }

  if (trimmed === 'this month') {
    return { from: toIsoDate(now.startOf('month')), to: toIsoDate(now.endOf('month')) };
  }

  if (trimmed === 'last month') {
    const value = now.minus({ months: 1 });
    return { from: toIsoDate(value.startOf('month')), to: toIsoDate(value.endOf('month')) };
  }

  if (trimmed === 'next month') {
    const value = now.plus({ months: 1 });
    return { from: toIsoDate(value.startOf('month')), to: toIsoDate(value.endOf('month')) };
  }

  if (trimmed === 'year to date') {
    return { from: toIsoDate(now.startOf('year')), to: toIsoDate(now.endOf('day')) };
  }

  if (trimmed === 'this year') {
    return { from: toIsoDate(now.startOf('year')), to: toIsoDate(now.endOf('year')) };
  }

  if (trimmed === 'last year') {
    const value = now.minus({ years: 1 });
    return { from: toIsoDate(value.startOf('year')), to: toIsoDate(value.endOf('year')) };
  }

  if (trimmed === 'next year') {
    const value = now.plus({ years: 1 });
    return { from: toIsoDate(value.startOf('year')), to: toIsoDate(value.endOf('year')) };
  }

  if (trimmed === 'this quarter') {
    return { from: toIsoDate(now.startOf('quarter')), to: toIsoDate(now.endOf('quarter')) };
  }

  if (trimmed === 'last quarter') {
    const value = now.minus({ quarters: 1 });
    return { from: toIsoDate(value.startOf('quarter')), to: toIsoDate(value.endOf('quarter')) };
  }

  if (trimmed === 'next quarter') {
    const value = now.plus({ quarters: 1 });
    return { from: toIsoDate(value.startOf('quarter')), to: toIsoDate(value.endOf('quarter')) };
  }

  const lastPeriods = trimmed.match(/^last\s+(\d+)\s+(day|days|week|weeks|month|months|quarter|quarters|year|years)$/);
  if (lastPeriods) {
    const [, amountRaw, unitRaw] = lastPeriods;
    const amount = Number(amountRaw);
    const unit = (unitRaw.endsWith('s') ? unitRaw : `${unitRaw}s`) as
      | 'days'
      | 'weeks'
      | 'months'
      | 'quarters'
      | 'years';
    const start = shiftDate(now, unit, -(amount - 1));
    return {
      from: toIsoDate(startOfUnit(start, unit)),
      to: toIsoDate(endOfUnit(now, unit)),
    };
  }

  const relativePeriods = trimmed.match(/^(\d+)\s+(day|days|week|weeks|month|months|quarter|quarters|year|years)\s+(ago|ahead)$/);
  if (relativePeriods) {
    const [, amountRaw, unitRaw, direction] = relativePeriods;
    const amount = Number(amountRaw);
    const pluralUnit = (unitRaw.endsWith('s') ? unitRaw : `${unitRaw}s`) as
      | 'days'
      | 'weeks'
      | 'months'
      | 'quarters'
      | 'years';
    const target =
      direction === 'ago'
        ? shiftDate(now, pluralUnit, -amount)
        : shiftDate(now, pluralUnit, amount);

    return {
      from: toIsoDate(startOfUnit(target, pluralUnit)),
      to: toIsoDate(endOfUnit(target, pluralUnit)),
    };
  }

  return null;
}

function parseRelativeRangePeriod(period: string) {
  const match = period.match(/^(.+?)\s*-\s*(.+)$/);
  if (!match) {
    return null;
  }

  const [, rawFrom, rawTo] = match;
  const from = parseSimpleRelativeToken(rawFrom);
  const to = parseSimpleRelativeToken(rawTo);

  if (!from || !to) {
    return null;
  }

  return {
    from: from.from,
    to: to.to,
  };
}

function resolvePeriod(period: string) {
  return (
    parseQuarterPeriod(period) ??
    parseSimpleRelativeToken(period) ??
    parseRelativeRangePeriod(period)
  );
}

export function resolveDashboardDateFilter(
  dateFilter?: DashboardDateFilterValue,
): ResolvedDateFilter {
  const fallback: ResolvedDateFilter = {
    mode: dateFilter?.mode ?? 'all-time',
    period: dateFilter?.period ?? '',
    from: '',
    to: '',
  };

  if (!dateFilter) {
    return fallback;
  }

  if (dateFilter.customDate.from || dateFilter.customDate.to) {
    return {
      mode: dateFilter.mode,
      period: dateFilter.period,
      from: dateFilter.customDate.from,
      to: dateFilter.customDate.to,
    };
  }

  if (!dateFilter.period) {
    return fallback;
  }

  const resolved = resolvePeriod(dateFilter.period);
  if (!resolved) {
    return fallback;
  }

  return {
    mode: dateFilter.mode,
    period: dateFilter.period,
    from: resolved.from,
    to: resolved.to,
  };
}
