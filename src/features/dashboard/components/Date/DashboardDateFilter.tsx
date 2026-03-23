import { Box, Button, Divider, Popover, Stack } from '@mui/material';
import { useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { DateFilterPanelHeader } from './DateFilterPanelHeader';
import { DateFilterTrigger } from './DateFilterTrigger';
import { PredefinedPeriodsList } from './PredefinedPeriodsList';
import { RelativePeriodFields } from './RelativePeriodFields';
import { StaticPeriodFields } from './StaticPeriodFields';
import {
  defaultPredefinedPeriod,
  defaultQuarterRange,
  defaultStaticRange,
  quickPeriodsByUnit,
  relativeKeywordsByUnit,
  relativeOptionsByUnit,
  todayIso,
} from './dateFilter.constants';
import {
  buildTypedRelativeOptions,
  formatQuarterRange,
  getInitialRange,
  getInitialUnit,
  summarizeSelection,
} from './dateFilter.utils';
import type {
  DashboardDateFilterProps,
  DashboardDateFilterValue,
  FilterMode,
  RelativeUnit,
} from './dateFilter.types';

export type { DashboardDateFilterValue } from './dateFilter.types';

export function DashboardDateFilter({
  options,
  initialValue,
  onApply,
}: DashboardDateFilterProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [mode, setMode] = useState<FilterMode>('all-time');
  const [unit, setUnit] = useState<RelativeUnit>(getInitialUnit());
  const [range, setRange] = useState(getInitialRange(initialValue));
  const [predefinedPeriod, setPredefinedPeriod] = useState(
    defaultPredefinedPeriod,
  );
  const [staticRange, setStaticRange] = useState(defaultStaticRange);
  const [quarterRange, setQuarterRange] = useState(defaultQuarterRange);

  const resetToDefault = () => {
    setMode('all-time');
    setUnit(getInitialUnit());
    setRange(getInitialRange(initialValue));
    setPredefinedPeriod(defaultPredefinedPeriod);
    setStaticRange(defaultStaticRange);
    setQuarterRange(defaultQuarterRange);
  };

  const switchMode = (nextMode: FilterMode) => {
    setMode(nextMode);
    setUnit(getInitialUnit());
    setRange({ from: '', to: '' });
    setStaticRange(defaultStaticRange);
    setQuarterRange(defaultQuarterRange);
    setPredefinedPeriod(
      nextMode === 'all-time' ? defaultPredefinedPeriod : '',
    );
  };

  const triggerLabel = useMemo(() => {
    if (mode === 'all-time') {
      return 'All time';
    }

    if (predefinedPeriod) {
      return predefinedPeriod;
    }

    if (mode === 'static') {
      return `${staticRange.from} - ${staticRange.to}`;
    }

    if (mode === 'relative' && unit === 'quarters') {
      const quarterPeriod = formatQuarterRange(quarterRange);
      if (quarterPeriod) {
        return quarterPeriod;
      }
    }

    const matched = options.find((option) => option.value === initialValue);
    return matched?.label ?? summarizeSelection(range.from, range.to);
  }, [
    initialValue,
    mode,
    options,
    predefinedPeriod,
    quarterRange,
    range.from,
    range.to,
    staticRange.from,
    staticRange.to,
    unit,
  ]);

  const handleStaticRangeChange =
    (field: 'from' | 'to') => (event: ChangeEvent<HTMLInputElement>) => {
      setPredefinedPeriod('');
      setStaticRange((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  const handleRelativeInputChange = (
    field: 'from' | 'to',
    value: string | null,
  ) => {
    setPredefinedPeriod('');
    setRange((current) => ({ ...current, [field]: value ?? '' }));
  };

  const handleQuarterRangeChange =
    (field: 'fromQuarter' | 'fromYear' | 'toQuarter' | 'toYear') =>
    (event: { target: { value: string } }) => {
      setPredefinedPeriod('');
      setQuarterRange((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  const getAutocompleteOptions = (inputValue: string) => {
    const dynamicOptions = buildTypedRelativeOptions(unit, inputValue);
    return Array.from(
      new Set([
        ...dynamicOptions,
        ...relativeOptionsByUnit[unit],
        ...relativeKeywordsByUnit[unit],
      ]),
    );
  };

  const handleApply = () => {
    const customDate =
      mode === 'static' && (staticRange.from || staticRange.to)
        ? staticRange
        : { from: '', to: '' };

    const quarterPeriod = formatQuarterRange(quarterRange);
    const period =
      customDate.from || customDate.to
        ? ''
        : predefinedPeriod ||
          (mode === 'relative' && unit === 'quarters'
            ? quarterPeriod
            : summarizeSelection(range.from, range.to));

    const nextValue: DashboardDateFilterValue = {
      mode,
      period,
      customDate,
    };

    onApply?.(nextValue);
    setAnchorEl(null);
  };

  return (
    <>
      <DateFilterTrigger
        label={triggerLabel}
        onClick={(event) => setAnchorEl(event.currentTarget)}
      />

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              width: 400,
              maxWidth: 'calc(100vw - 24px)',
              borderRadius: '6px',
              border: '1px solid #d8dee9',
              boxShadow: '0 20px 45px rgba(15, 23, 42, 0.18)',
              overflow: 'hidden',
            },
          },
        }}
      >
        <Box sx={{ bgcolor: 'white' }}>
          <DateFilterPanelHeader
            mode={mode}
            onReset={resetToDefault}
            onSwitchMode={switchMode}
          />

          {mode === 'static' ? (
            <StaticPeriodFields
              value={staticRange}
              maxDate={todayIso}
              onChange={handleStaticRangeChange}
            />
          ) : null}

          {mode === 'relative' ? (
            <RelativePeriodFields
              unit={unit}
              fromValue={range.from}
              toValue={range.to}
              quarterRange={quarterRange}
              getAutocompleteOptions={getAutocompleteOptions}
              onUnitChange={setUnit}
              onRelativeInputChange={handleRelativeInputChange}
              onQuarterRangeChange={handleQuarterRangeChange}
            />
          ) : null}

          <PredefinedPeriodsList
            groups={quickPeriodsByUnit[unit]}
            selectedPeriod={predefinedPeriod}
            onSelect={setPredefinedPeriod}
          />

          <Divider />

          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
            sx={{ px: 1.5, py: 1.25 }}
          >
            <Button
              variant='outlined'
              onClick={() => setAnchorEl(null)}
              sx={{
                minWidth: 88,
                textTransform: 'none',
                borderColor: '#cbd5e1',
                color: '#64748b',
              }}
            >
              Cancel
            </Button>
            <Button
              variant='contained'
              onClick={handleApply}
              sx={{
                minWidth: 88,
                textTransform: 'none',
                bgcolor: '#0ea5e9',
                boxShadow: 'none',
                '&:hover': { bgcolor: '#0284c7', boxShadow: 'none' },
              }}
            >
              Apply
            </Button>
          </Stack>
        </Box>
      </Popover>
    </>
  );
}
