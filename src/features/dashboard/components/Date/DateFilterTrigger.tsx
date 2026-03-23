import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { Button, Stack, Typography } from '@mui/material';

type DateFilterTriggerProps = {
  label: string;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
};

export function DateFilterTrigger({
  label,
  onClick,
}: DateFilterTriggerProps) {
  return (
    <Button
      variant='outlined'
      onClick={onClick}
      startIcon={<CalendarMonthRoundedIcon />}
      endIcon={<KeyboardArrowDownRoundedIcon />}
      sx={{
        minWidth: 240,
        justifyContent: 'space-between',
        bgcolor: 'white',
        borderColor: '#dbe4ee',
        color: '#0f172a',
        textTransform: 'none',
        px: 1.5,
        py: 0.9,
      }}
    >
      <Stack spacing={0.1} alignItems='flex-start'>
        <Typography
          sx={{
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#94a3b8',
          }}
        >
          Date Filter
        </Typography>
        <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: '#0f172a' }}>
          {label}
        </Typography>
      </Stack>
    </Button>
  );
}
