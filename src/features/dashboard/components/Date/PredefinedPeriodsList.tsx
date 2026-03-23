import { alpha, Box, Stack, Typography } from '@mui/material';
import { titleCase } from './dateFilter.utils';
import type { QuickPeriodGroup } from './dateFilter.types';

type PredefinedPeriodsListProps = {
  groups: QuickPeriodGroup[];
  selectedPeriod: string;
  onSelect: (item: string) => void;
};

export function PredefinedPeriodsList({
  groups,
  selectedPeriod,
  onSelect,
}: PredefinedPeriodsListProps) {
  return (
    <Box sx={{ px: 1.5, pb: 1.5, maxHeight: 300, overflowY: 'auto' }}>
      <Stack spacing={1.8}>
        {groups.map((group) => (
          <Box key={group.label}>
            <Typography
              sx={{
                mb: 0.55,
                fontSize: 12,
                fontWeight: 700,
                color: '#94a3b8',
              }}
            >
              {group.label}
            </Typography>
            <Stack spacing={0.65}>
              {group.items.map((item) => (
                <Box
                  key={item}
                  onClick={() => onSelect(item)}
                  sx={{
                    fontSize: 14,
                    color: item === selectedPeriod ? '#0ea5e9' : '#475569',
                    fontWeight: item === selectedPeriod ? 700 : 500,
                    px: 0.25,
                    py: 0.2,
                    cursor: 'pointer',
                    bgcolor:
                      item === selectedPeriod
                        ? alpha('#0ea5e9', 0.12)
                        : 'transparent',
                  }}
                >
                  {titleCase(item)}
                </Box>
              ))}
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
