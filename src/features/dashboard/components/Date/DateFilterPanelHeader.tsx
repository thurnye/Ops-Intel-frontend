import { Button, Divider, Stack, Typography } from '@mui/material';
import type { FilterMode } from './dateFilter.types';

type DateFilterPanelHeaderProps = {
  mode: FilterMode;
  onReset: () => void;
  onSwitchMode: (mode: FilterMode) => void;
};

export function DateFilterPanelHeader({
  mode,
  onReset,
  onSwitchMode,
}: DateFilterPanelHeaderProps) {
  return (
    <>
      <Stack
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        sx={{ px: 2.25, pt: 1.25, pb: 0.9 }}
      >
        <Typography sx={{ fontSize: 12.5, color: '#8a97a8' }}>
          Set date filter:
        </Typography>
        <Button
          variant='text'
          onClick={onReset}
          sx={{
            minWidth: 0,
            p: 0,
            textTransform: 'none',
            fontSize: 13,
            fontWeight: 700,
            color: '#0ea5e9',
          }}
        >
          Reset
        </Button>
      </Stack>

      <Divider />

      <Stack
        spacing={3}
        sx={{ px: 3, pt: 1.4 }}
        direction='row'
        alignItems='center'
        justifyContent='space-between'
      >
        {(['all-time', 'static', 'relative'] as FilterMode[]).map((item) => (
          <Button
            key={item}
            variant='text'
            onClick={() => onSwitchMode(item)}
            sx={{
              justifyContent: 'flex-start',
              p: 0,
              minWidth: 0,
              textTransform: 'none',
              color: mode === item ? '#0ea5e9' : '#334155',
              fontWeight: mode === item ? 700 : 500,
            }}
          >
            {item === 'all-time'
              ? 'All time'
              : item === 'static'
                ? 'Static period'
                : 'Relative period'}
          </Button>
        ))}
      </Stack>

      <Stack sx={{ px: 3, pt: 1, pb: 2 }}>
        <Divider />
      </Stack>
    </>
  );
}
