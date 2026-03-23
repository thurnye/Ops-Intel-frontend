import { Box, Stack, TextField, Typography } from '@mui/material';
import type { ChangeEvent } from 'react';
import type { StaticRange } from './dateFilter.types';

type StaticPeriodFieldsProps = {
  value: StaticRange;
  maxDate: string;
  onChange: (field: 'from' | 'to') => (event: ChangeEvent<HTMLInputElement>) => void;
};

export function StaticPeriodFields({
  value,
  maxDate,
  onChange,
}: StaticPeriodFieldsProps) {
  return (
    <Box
      sx={{
        mx: 1.5,
        mb: 1.5,
        bgcolor: '#f8fafc',
        px: 1.75,
        py: 1.3,
      }}
    >
      <Stack direction='row' spacing={1} alignItems='center'>
        <TextField
          size='small'
          type='date'
          value={value.from}
          onChange={onChange('from')}
          sx={{ flex: 1, bgcolor: 'white' }}
          InputLabelProps={{ shrink: true }}
          inputProps={{ max: maxDate }}
        />
        <Typography sx={{ color: '#94a3b8' }}>-</Typography>
        <TextField
          size='small'
          type='date'
          value={value.to}
          onChange={onChange('to')}
          sx={{ flex: 1, bgcolor: 'white' }}
          InputLabelProps={{ shrink: true }}
          inputProps={{ max: maxDate }}
        />
      </Stack>
    </Box>
  );
}
