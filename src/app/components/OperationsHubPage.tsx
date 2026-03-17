import type { ReactNode } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { FieldHelp } from '@app/components/FieldHelp';
import { Link as RouterLink } from 'react-router-dom';

type HubStat = {
  label: string;
  value: string | number;
  tone?: string;
  description?: string;
  icon?: ReactNode;
};

type HubAction = {
  title: string;
  description: string;
  to: string;
  cta: string;
};

type Props = {
  title: string;
  description: string;
  eyebrow?: string;
  stats: HubStat[];
  actions: HubAction[];
  highlights?: string[];
};

export function OperationsHubPage({
  title,
  description,
  eyebrow,
  stats,
  actions,
  highlights = [],
}: Props) {
  return (
    <Container maxWidth={false} disableGutters className='space-y-6'>
      <Box size={{ xs: 12, md: 8 }}>
        <Stack spacing={2.25}>
          {eyebrow ? (
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
              variant='body2'
              color='text.secondary'
            >
              {eyebrow}
            </Typography>
          ) : null}
          <Box>
            <Typography variant='h4'>
              {title}
            </Typography>
            <Typography
              sx={{ mt: 1, maxWidth: 760, fontSize: 14, lineHeight: 1.7 }}
              variant='body2'
              color='text.secondary'
            >
              {description}
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Grid container spacing={2.5}>
        {stats.map((stat) => (
          <Grid key={stat.label} size={{ xs: 6, md: 3 }}>
            <Card
              sx={{
                height: '100%',
                background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Stack
                  direction='row'
                  justifyContent='space-between'
                  alignItems='flex-start'
                  sx={{ mb: 1 }}
                >
                  <Stack direction='row' spacing={0.5} alignItems='center'>
                    <Typography
                      sx={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}
                    >
                      {stat.label}
                    </Typography>
                    {stat.description ? (
                      <FieldHelp
                        title={stat.label}
                        description={stat.description}
                      />
                    ) : null}
                  </Stack>
                  {stat.icon ? (
                    <Stack
                      alignItems='center'
                      justifyContent='center'
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: 2.5,
                        bgcolor: `${stat.tone ?? '#0f172a'}14`,
                        color: stat.tone ?? '#0f172a',
                        flexShrink: 0,
                      }}
                    >
                      {stat.icon}
                    </Stack>
                  ) : null}
                </Stack>
                <Typography
                  sx={{
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    color: stat.tone ?? '#0f172a',
                    lineHeight: 1.1,
                  }}
                >
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.5}>
        {actions.map((action) => (
          <Grid key={action.title} size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                height: '100%',
                background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
              }}
            >
              <CardContent
                sx={{
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2.5,
                  height: '100%',
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: '#0f172a',
                      mb: 1,
                    }}
                  >
                    {action.title}
                  </Typography>
                  <Typography
                    sx={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.6 }}
                  >
                    {action.description}
                  </Typography>
                </Box>
                <Box sx={{ mt: 'auto' }}>
                  <Button
                    component={RouterLink}
                    to={action.to}
                    variant='outlined'
                  >
                    {action.cta}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
