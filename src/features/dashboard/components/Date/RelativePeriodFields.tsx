import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import {
  Autocomplete,
  Box,
  MenuItem,
  Select,
  Stack,
  Tab,
  TextField,
  Tabs,
  Typography,
} from '@mui/material';
import {
  quarterOptions,
  unitTabs,
  yearOptions,
} from './dateFilter.constants';
import type { QuarterRange, RelativeUnit } from './dateFilter.types';

type RelativePeriodFieldsProps = {
  unit: RelativeUnit;
  fromValue: string;
  toValue: string;
  quarterRange: QuarterRange;
  getAutocompleteOptions: (inputValue: string) => string[];
  onUnitChange: (value: RelativeUnit) => void;
  onRelativeInputChange: (field: 'from' | 'to', value: string | null) => void;
  onQuarterRangeChange: (
    field: 'fromQuarter' | 'fromYear' | 'toQuarter' | 'toYear',
  ) => (event: { target: { value: string } }) => void;
};

export function RelativePeriodFields({
  unit,
  fromValue,
  toValue,
  quarterRange,
  getAutocompleteOptions,
  onUnitChange,
  onRelativeInputChange,
  onQuarterRangeChange,
}: RelativePeriodFieldsProps) {
  return (
    <Box
      sx={{
        mx: 1.5,
        mb: 1.5,
        bgcolor: '#f8fafc',
      }}
    >
      <Box sx={{ px: 1.75, pt: 1.3 }}>
        <Tabs
          value={unit}
          onChange={(_, value: RelativeUnit) => onUnitChange(value)}
          variant='scrollable'
          scrollButtons={false}
          sx={{
            minHeight: 30,
            '& .MuiTab-root': {
              minHeight: 30,
              minWidth: 0,
              px: 1,
              py: 0.4,
              fontSize: 12,
              textTransform: 'none',
              color: '#6b7280',
            },
            '& .Mui-selected': {
              color: '#0f172a',
              fontWeight: 700,
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#1d9bf0',
              height: 2,
            },
          }}
        >
          {unitTabs.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={tab.label}
              disableRipple
            />
          ))}
        </Tabs>
      </Box>

      <Stack direction='row' spacing={1} sx={{ px: 1.75, py: 1.3 }}>
        {unit === 'quarters' ? (
          <Stack direction='row' spacing={1} sx={{ flex: 1 }}>
            <Select
              size='small'
              value={quarterRange.fromQuarter}
              onChange={onQuarterRangeChange('fromQuarter')}
              displayEmpty
              sx={{ minWidth: 50, bgcolor: 'white' }}
              renderValue={(value) => (value ? value : 'Q')}
            >
              <MenuItem value=''>
                <em>Q</em>
              </MenuItem>
              {quarterOptions.map((quarter) => (
                <MenuItem key={quarter} value={quarter}>
                  {quarter}
                </MenuItem>
              ))}
            </Select>
            <Select
              size='small'
              value={quarterRange.fromYear}
              onChange={onQuarterRangeChange('fromYear')}
              displayEmpty
              sx={{ flex: 1, bgcolor: 'white' }}
              renderValue={(value) => (value ? value : 'Year')}
            >
              <MenuItem value=''>
                <em>Year</em>
              </MenuItem>
              {yearOptions.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </Stack>
        ) : (
          <Autocomplete
            freeSolo
            options={getAutocompleteOptions(fromValue)}
            value={fromValue}
            onChange={(_, value) => onRelativeInputChange('from', value)}
            onInputChange={(_, value) => onRelativeInputChange('from', value)}
            popupIcon={<KeyboardArrowDownRoundedIcon />}
            sx={{ flex: 1 }}
            slotProps={{
              paper: {
                sx: {
                  borderRadius: '4px',
                  boxShadow: '0 10px 25px rgba(15, 23, 42, 0.12)',
                },
              },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                size='small'
                placeholder='from'
                sx={{ bgcolor: 'white' }}
              />
            )}
          />
        )}

        <Typography sx={{ alignSelf: 'center', color: '#94a3b8' }}>
          -
        </Typography>

        {unit === 'quarters' ? (
          <Stack direction='row' spacing={1} sx={{ flex: 1 }}>
            <Select
              size='small'
              value={quarterRange.toQuarter}
              onChange={onQuarterRangeChange('toQuarter')}
              displayEmpty
              sx={{ minWidth: 50, bgcolor: 'white' }}
              renderValue={(value) => (value ? value : 'Q')}
            >
              <MenuItem value=''>
                <em>Q</em>
              </MenuItem>
              {quarterOptions.map((quarter) => (
                <MenuItem key={quarter} value={quarter}>
                  {quarter}
                </MenuItem>
              ))}
            </Select>
            <Select
              size='small'
              value={quarterRange.toYear}
              onChange={onQuarterRangeChange('toYear')}
              displayEmpty
              sx={{ flex: 1, bgcolor: 'white' }}
              renderValue={(value) => (value ? value : 'Year')}
            >
              <MenuItem value=''>
                <em>Year</em>
              </MenuItem>
              {yearOptions.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </Stack>
        ) : (
          <Autocomplete
            freeSolo
            options={getAutocompleteOptions(toValue)}
            value={toValue}
            onChange={(_, value) => onRelativeInputChange('to', value)}
            onInputChange={(_, value) => onRelativeInputChange('to', value)}
            popupIcon={<KeyboardArrowDownRoundedIcon />}
            sx={{ flex: 1 }}
            slotProps={{
              paper: {
                sx: {
                  borderRadius: '4px',
                  boxShadow: '0 10px 25px rgba(15, 23, 42, 0.12)',
                },
              },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                size='small'
                placeholder='to'
                sx={{ bgcolor: 'white' }}
              />
            )}
          />
        )}
      </Stack>
    </Box>
  );
}
