import type { QuickPeriodGroup, RelativeUnit } from './dateFilter.types';

export const unitTabs: { value: RelativeUnit; label: string }[] = [
  { value: 'years', label: 'Years' },
  { value: 'quarters', label: 'Quarters' },
  { value: 'months', label: 'Months' },
  { value: 'weeks', label: 'Weeks' },
  { value: 'days', label: 'Days' },
];

export const relativeOptionsByUnit: Record<RelativeUnit, string[]> = {
  years: ['2 years ago', 'last year', 'year to date', 'next year', '2 years ahead'],
  quarters: ['2 quarters ago', 'last quarter', 'this quarter', 'next quarter', '4 quarters ahead'],
  months: ['2 months ago', 'last month', 'this month', 'next month', '2 months ahead'],
  weeks: ['2 weeks ago', 'last week', 'this week', 'next week', '2 weeks ahead'],
  days: ['7 days ago', 'yesterday', 'today', 'tomorrow', '7 days ahead'],
};

export const quickPeriodsByUnit: Record<RelativeUnit, QuickPeriodGroup[]> = {
  years: [
    { label: 'YEAR', items: ['Year To Date', 'Last year', 'Last 3 years'] },
    { label: 'QUARTER', items: ['This quarter', 'Last quarter', 'Last 4 quarters'] },
    { label: 'MONTH', items: ['This month', 'Last month', 'Last 12 months'] },
  ],
  quarters: [
    { label: 'QUARTER', items: ['This quarter', 'Last quarter', 'Last 3 quarters'] },
    { label: 'MONTH', items: ['This month', 'Last month', 'Last 6 months'] },
    { label: 'WEEK', items: ['This week', 'Last week', 'Last 8 weeks'] },
  ],
  months: [
    { label: 'YEAR', items: ['Year To Date', 'Last year'] },
    { label: 'QUARTER', items: ['This quarter', 'Last quarter', 'Last 4 quarters'] },
    { label: 'MONTH', items: ['This month', 'Last month', 'Last 12 months'] },
    { label: 'WEEK', items: ['This week', 'Last week'] },
  ],
  weeks: [
    { label: 'MONTH', items: ['This month', 'Last month', 'Last 3 months'] },
    { label: 'WEEK', items: ['This week', 'Last week', 'Last 12 weeks'] },
    { label: 'DAY', items: ['Today', 'Yesterday', 'Last 14 days'] },
  ],
  days: [
    { label: 'WEEK', items: ['This week', 'Last week'] },
    { label: 'DAY', items: ['Today', 'Yesterday', 'Last 30 days'] },
  ],
};

export const relativeKeywordsByUnit: Record<RelativeUnit, string[]> = {
  years: ['last year', 'year to date', 'next year'],
  quarters: ['last quarter', 'this quarter', 'next quarter'],
  months: ['last month', 'this month', 'next month'],
  weeks: ['last week', 'this week', 'next week'],
  days: ['yesterday', 'today', 'tomorrow'],
};

export const defaultStaticRange = { from: '', to: '' };
export const defaultQuarterRange = {
  fromQuarter: '',
  fromYear: '',
  toQuarter: '',
  toYear: '',
};
export const defaultPredefinedPeriod = 'Year To Date';
export const todayIso = new Date().toISOString().slice(0, 10);
export const quarterOptions = ['Q1', 'Q2', 'Q3', 'Q4'];
const currentYear = new Date().getFullYear();
export const yearOptions = Array.from({ length: 11 }, (_, index) =>
  String(currentYear - index),
);
