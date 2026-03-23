import type { DashboardSelectOption } from '@features/dashboard/types/dashboard.types';

export type RelativeUnit = 'years' | 'quarters' | 'months' | 'weeks' | 'days';
export type FilterMode = 'all-time' | 'static' | 'relative';

export type DashboardDateFilterValue = {
  mode: FilterMode;
  period: string;
  customDate: {
    from: string;
    to: string;
  };
};

export type DashboardDateFilterProps = {
  options: DashboardSelectOption[];
  initialValue?: string;
  onApply?: (value: DashboardDateFilterValue) => void;
};

export type QuickPeriodGroup = {
  label: string;
  items: string[];
};

export type StaticRange = {
  from: string;
  to: string;
};

export type QuarterRange = {
  fromQuarter: string;
  fromYear: string;
  toQuarter: string;
  toYear: string;
};
