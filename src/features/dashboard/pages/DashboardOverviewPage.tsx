import {
  Alert,
  alpha,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CircleRoundedIcon from '@mui/icons-material/CircleRounded';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch } from '@app/hooks/app.hooks';
import { AppBarChart, AppLineChart, AppPieChart } from '@app/components/charts';
import { DashboardCard } from '@features/dashboard/components/DashboardCard';
import { DashboardDataTable } from '@features/dashboard/components/DashboardDataTable';
import { DashboardModuleHealthCard } from '@features/dashboard/components/DashboardModuleHealthCard';
import { DashboardSectionTitle } from '@features/dashboard/components/DashboardSectionTitle';
import { KpiCard } from '@features/dashboard/components/KpiCard';
import { useDashboard } from '@features/dashboard/hooks/useDashboard';
import { fetchDashboardOverview } from '@features/dashboard/redux/dashboard.thunks';
import { renderDashboardIcon } from '@features/dashboard/utils/dashboard.icons';
import {
  createDashboardOrderColumns,
  createDashboardStockColumns,
} from '@features/dashboard/utils/dashboard.table-columns';
import { getDashboardAlertSeverityColor } from '@features/dashboard/utils/dashboard.utils';
import {
  DashboardDateFilter,
  type DashboardDateFilterValue,
} from '../components/Date/DashboardDateFilter';

export function DashboardOverviewPage() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const {
    overview,
    selectedSite,
    dateFilter,
    loading,
    error,
    onSiteChange,
    onDateFilterChange,
  } = useDashboard();
  const [legacyRange, setLegacyRange] = useState('30d');

  const orderColumns = useMemo(() => createDashboardOrderColumns(), []);
  const stockColumns = useMemo(() => createDashboardStockColumns(), []);

  useEffect(() => {
    void dispatch(
      fetchDashboardOverview({
        site: selectedSite,
        dateFilter,
      }),
    );
  }, [dateFilter, dispatch, selectedSite]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fb', p: { xs: 2, md: 3 } }}>
      <Stack spacing={3}>
        {loading ? <LinearProgress sx={{ borderRadius: 999 }} /> : null}
        {error ? <Alert severity='error'>{error}</Alert> : null}
        <Stack
          direction={{ xs: 'column', lg: 'row' }}
          spacing={2}
          justifyContent='space-between'
          alignItems={{ xs: 'flex-start', lg: 'center' }}
        >
          <Box>
            <Typography variant='h4' fontWeight={800}>
              {overview.header.title}
            </Typography>
            <Typography
              variant='body2'
              color='text.secondary'
              sx={{ mt: 0.75 }}
            >
              {overview.header.subtitle}
            </Typography>
          </Box>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            alignItems='center'
          >

            <DashboardDateFilter
              options={overview.header.rangeOptions}
              initialValue={legacyRange}
              onApply={(value: DashboardDateFilterValue) => {
                onDateFilterChange(value);
                console.log('Dashboard date filter selection', value);
                void dispatch(
                  fetchDashboardOverview({
                    site: selectedSite,
                    dateFilter: value,
                  }),
                );
              }}
            />

            <Select
              size='small'
              value={selectedSite}
              onChange={(event) => onSiteChange(event.target.value)}
              sx={{ minWidth: 150, bgcolor: 'white' }}
            >
              {overview.header.siteOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>

            <Button
              variant='outlined'
              startIcon={<RefreshRoundedIcon />}
              onClick={() => {
                void dispatch(
                  fetchDashboardOverview({
                    site: selectedSite,
                    dateFilter,
                  }),
                );
              }}
            >
              {overview.header.refreshLabel}
            </Button>
            <Button variant='outlined' startIcon={<FileDownloadOutlinedIcon />}>
              {overview.header.exportLabel}
            </Button>
            <IconButton
              sx={{
                bgcolor: 'white',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              {renderDashboardIcon('notifications')}
            </IconButton>
          </Stack>
        </Stack>

        {/* KPI Cards */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(3, 1fr)',
              xl: 'repeat(6, 1fr)',
            },
            gap: 2,
          }}
        >
          {overview.kpis.map((kpi) => (
            <KpiCard key={kpi.id} kpi={kpi} />
          ))}
        </Box>

        {/* Business Overview */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', xl: '2fr 1fr' },
            gap: 2,
          }}
        >
          <DashboardCard
            title={overview.businessPerformance.title}
            action={
              <Stack direction='row' spacing={1}>
                {overview.businessPerformance.metricChips.map((chip, index) => (
                  <Chip
                    key={chip}
                    label={chip}
                    size='small'
                    color={index === 0 ? 'primary' : 'default'}
                    variant={index === 0 ? 'filled' : 'outlined'}
                  />
                ))}
              </Stack>
            }
            minHeight={420}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
                gap: 2,
                height: '100%',
              }}
            >
              <Paper
                variant='outlined'
                sx={{
                  p: 2,
                  borderRadius: 1,
                  height: 320,
                  borderColor: 'divider',
                }}
              >
                <Typography
                  variant='subtitle2'
                  color='text.secondary'
                  sx={{ mb: 1 }}
                >
                  {overview.businessPerformance.revenueTrendTitle}
                </Typography>
                <AppLineChart
                  height={260}
                  labels={overview.businessPerformance.revenueTrend.labels}
                  series={overview.businessPerformance.revenueTrend.series.map(
                    (series) => ({
                      data: series.data,
                      label: series.label,
                      curve: 'monotoneX',
                    }),
                  )}
                />
              </Paper>

              <Stack spacing={2}>
                {overview.businessPerformance.progressCards.map((card) => (
                  <Paper
                    key={card.id}
                    variant='outlined'
                    sx={{ p: 2, borderRadius: 1 }}
                  >
                    <Typography variant='subtitle2' color='text.secondary'>
                      {card.title}
                    </Typography>
                    <Typography variant='h4' fontWeight={800} sx={{ mt: 1 }}>
                      {card.value}
                    </Typography>
                    {card.description ? (
                      <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{ mt: 1 }}
                      >
                        {card.description}
                      </Typography>
                    ) : null}
                    <LinearProgress
                      color={card.color}
                      variant='determinate'
                      value={card.progress}
                      sx={{ mt: 2, height: 8, borderRadius: 999 }}
                    />
                  </Paper>
                ))}
              </Stack>
            </Box>
          </DashboardCard>

          <DashboardCard
            title={overview.attentionRequired.title}
            action={
              <IconButton size='small'>
                <MoreHorizIcon />
              </IconButton>
            }
            minHeight={420}
          >
            <Stack spacing={1.5}>
              {overview.attentionRequired.alerts.map((alert) => (
                <Paper
                  key={alert.id}
                  variant='outlined'
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    borderLeft: '4px solid',
                    borderLeftColor:
                      alert.severity === 'Critical'
                        ? theme.palette.error.main
                        : alert.severity === 'Warning'
                          ? theme.palette.warning.main
                          : theme.palette.info.main,
                  }}
                >
                  <Stack spacing={1}>
                    <Stack
                      direction='row'
                      justifyContent='space-between'
                      alignItems='center'
                    >
                      <Typography fontWeight={700}>{alert.title}</Typography>
                      <Chip
                        size='small'
                        label={alert.severity}
                        color={getDashboardAlertSeverityColor(alert.severity)}
                      />
                    </Stack>
                    <Typography variant='body2' color='text.secondary'>
                      {alert.detail}
                    </Typography>
                  </Stack>
                </Paper>
              ))}

              <Divider sx={{ my: 1 }} />

              <Stack spacing={1}>
                <Typography variant='subtitle2' color='text.secondary'>
                  {overview.attentionRequired.quickActionsTitle}
                </Typography>
                <Stack direction='row' spacing={1} flexWrap='wrap' useFlexGap>
                  {overview.attentionRequired.quickActions.map((action) => (
                    <Button
                      key={action.id}
                      startIcon={
                        action.iconKey === 'task' ? (
                          <AddRoundedIcon />
                        ) : (
                          renderDashboardIcon(action.iconKey)
                        )
                      }
                      variant={action.variant}
                    >
                      {action.label}
                    </Button>
                  ))}
                </Stack>
              </Stack>
            </Stack>
          </DashboardCard>
        </Box>

        {/* Finance Analytics */}
        <Box sx={{ display: 'grid', gap: 2 }}>
          <DashboardSectionTitle title={overview.finance.sectionTitle} />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
              gap: 2,
            }}
          >
            <DashboardCard
              title={overview.finance.revenueExpenseTitle}
              minHeight={380}
            >
              <AppLineChart
                height={300}
                labels={overview.finance.revenueExpenseTrend.labels}
                series={overview.finance.revenueExpenseTrend.series}
              />
            </DashboardCard>

            <DashboardCard
              title={overview.finance.expenseBreakdownTitle}
              minHeight={380}
            >
              <AppPieChart
                height={300}
                data={overview.finance.expenseBreakdown}
                innerRadius={60}
              />
            </DashboardCard>
          </Box>
        </Box>

        {/* Operations */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
            gap: 2,
          }}
        >
          {overview.moduleHealth.cards.map((moduleCard) => (
            <DashboardModuleHealthCard
              key={moduleCard.id}
              moduleCard={moduleCard}
            />
          ))}
        </Box>

        {/* Operational Analytics */}
        <Box sx={{ display: 'grid', gap: 3 }}>
          <DashboardSectionTitle
            title={overview.analyticsHeader.title}
            subtitle={overview.analyticsHeader.subtitle}
          />

          {/* Inventory Analytics */}
          <Box sx={{ display: 'grid', gap: 2 }}>
            <DashboardSectionTitle title={overview.inventory.sectionTitle} />
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' },
                gap: 2,
              }}
            >
              <DashboardCard
                title={overview.inventory.lowStockTitle}
                minHeight={380}
              >
                <AppBarChart
                  height={300}
                  layout='horizontal'
                  labels={overview.inventory.lowStockChart.labels}
                  series={overview.inventory.lowStockChart.series}
                  showHorizontalGrid={false}
                  showVerticalGrid
                />
              </DashboardCard>

              <DashboardCard
                title={overview.inventory.inflowOutflowTitle}
                minHeight={360}
              >
                <AppLineChart
                  height={280}
                  labels={overview.inventory.inflowOutflowChart.labels}
                  series={overview.inventory.inflowOutflowChart.series}
                />
              </DashboardCard>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
                gap: 2,
              }}
            >
              <DashboardCard
                title={overview.inventory.warehouseCompositionTitle}
                minHeight={380}
              >
                <AppBarChart
                  height={300}
                  labels={overview.inventory.warehouseCompositionChart.labels}
                  series={overview.inventory.warehouseCompositionChart.series}
                />
              </DashboardCard>

              <DashboardCard
                title={overview.inventory.inventoryMixTitle}
                minHeight={360}
              >
                <AppPieChart
                  height={220}
                  data={overview.inventory.inventoryMix}
                  outerRadius={100}
                  showLegend
                />
              </DashboardCard>
            </Box>
          </Box>

          {/* Production Analytics */}
          <Box sx={{ display: 'grid', gap: 2 }}>
            <DashboardSectionTitle title={overview.production.sectionTitle} />
            <DashboardCard
              title={overview.production.efficiencyTitle}
              minHeight={340}
            >
              <AppLineChart
                height={280}
                labels={overview.production.efficiencyChart.labels}
                series={overview.production.efficiencyChart.series}
              />
            </DashboardCard>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: '1fr 2fr' },
                gap: 2,
              }}
            >
              <DashboardCard
                title={overview.production.statusMixTitle}
                minHeight={380}
              >
                <AppPieChart
                  height={300}
                  data={overview.production.statusMix}
                  innerRadius={60}
                />
              </DashboardCard>

              <DashboardCard
                title={overview.production.plannedVsActualTitle}
                minHeight={380}
              >
                <AppBarChart
                  height={300}
                  labels={overview.production.plannedVsActualChart.labels}
                  series={overview.production.plannedVsActualChart.series}
                />
              </DashboardCard>
            </Box>
          </Box>

          {/* Shipments Analytics */}
          <Box sx={{ display: 'grid', gap: 2 }}>
            <DashboardSectionTitle title={overview.shipments.sectionTitle} />
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: '1.2fr 1fr' },
                gap: 2,
              }}
            >
              <DashboardCard
                title={overview.shipments.onTimeVsDelayedTitle}
                minHeight={380}
              >
                <AppLineChart
                  height={300}
                  labels={overview.shipments.onTimeVsDelayedChart.labels}
                  series={overview.shipments.onTimeVsDelayedChart.series}
                />
              </DashboardCard>

              <DashboardCard
                title={overview.shipments.statusDistributionTitle}
                minHeight={380}
              >
                <AppPieChart
                  height={300}
                  data={overview.shipments.statusDistribution}
                  innerRadius={60}
                />
              </DashboardCard>
            </Box>

            <DashboardCard
              title={overview.shipments.weeklyOrdersVsShipmentsTitle}
              minHeight={360}
            >
              <AppBarChart
                height={280}
                labels={overview.shipments.weeklyOrdersVsShipmentsChart.labels}
                series={overview.shipments.weeklyOrdersVsShipmentsChart.series}
              />
            </DashboardCard>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                gap: 2,
              }}
            >
              <DashboardCard
                title={overview.shipments.teamTaskCompletionTitle}
                minHeight={360}
              >
                <Stack spacing={2}>
                  {overview.shipments.teamTaskCompletion.map((item) => (
                    <Box key={item.label}>
                      <Stack
                        direction='row'
                        justifyContent='space-between'
                        sx={{ mb: 0.75 }}
                      >
                        <Typography variant='body2' fontWeight={600}>
                          {item.label}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          {item.value}%
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant='determinate'
                        value={item.value}
                        sx={{ height: 10, borderRadius: 999 }}
                      />
                    </Box>
                  ))}
                </Stack>
              </DashboardCard>

              <DashboardCard
                title={overview.shipments.inventoryMixTitle}
                minHeight={360}
              >
                <AppPieChart
                  height={280}
                  data={overview.shipments.inventoryMix}
                  innerRadius={55}
                  outerRadius={100}
                />
              </DashboardCard>
            </Box>
          </Box>
        </Box>

        {/* Summaries */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
            gap: 2,
          }}
        >
          {overview.summarySnapshots.map((snapshot) => (
            <DashboardCard key={snapshot.id} title={snapshot.title}>
              <Stack spacing={2}>
                <Stack direction='row' justifyContent='space-between'>
                  <Stack direction='row' spacing={1} alignItems='center'>
                    <Box sx={{ color: `${snapshot.accentTone}.main` }}>
                      {renderDashboardIcon(snapshot.iconKey)}
                    </Box>
                    <Typography fontWeight={600}>
                      {snapshot.primaryLabel}
                    </Typography>
                  </Stack>
                  <Typography fontWeight={800}>
                    {snapshot.primaryValue}
                  </Typography>
                </Stack>
                {snapshot.stats.map((stat) => (
                  <Stack
                    key={stat.label}
                    direction='row'
                    justifyContent='space-between'
                  >
                    <Typography color='text.secondary'>{stat.label}</Typography>
                    <Typography fontWeight={700}>{stat.value}</Typography>
                  </Stack>
                ))}
              </Stack>
            </DashboardCard>
          ))}
        </Box>

        {/* Workflow */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            gap: 2,
          }}
        >
          <DashboardCard title={overview.workflow.title}>
            <Stack spacing={2}>
              {overview.workflow.steps.map((step) => (
                <Paper
                  key={step.label}
                  variant='outlined'
                  sx={{ p: 2, borderRadius: 1 }}
                >
                  <Stack spacing={1.2}>
                    <Stack
                      direction='row'
                      justifyContent='space-between'
                      alignItems='center'
                    >
                      <Stack direction='row' spacing={1} alignItems='center'>
                        <CircleRoundedIcon
                          sx={{ fontSize: 14, color: step.color }}
                        />
                        <Typography fontWeight={700}>{step.label}</Typography>
                      </Stack>
                      <Chip
                        label={`${step.count} items`}
                        size='small'
                        variant='outlined'
                      />
                    </Stack>
                    <LinearProgress
                      variant='determinate'
                      value={step.progress}
                      sx={{ height: 8, borderRadius: 999 }}
                    />
                    <Typography variant='caption' color='text.secondary'>
                      {step.progress}% throughput efficiency at this stage
                    </Typography>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </DashboardCard>

          <DashboardCard title={overview.activityFeed.title}>
            <Stack spacing={1.5}>
              {overview.activityFeed.items.map((activity) => (
                <Stack
                  key={activity.id}
                  direction='row'
                  spacing={1.5}
                  alignItems='flex-start'
                  sx={{
                    p: 1.5,
                    borderRadius: 3,
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <Box
                    sx={{
                      mt: '6px',
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      bgcolor: activity.color,
                      flexShrink: 0,
                    }}
                  />
                  <Box>
                    <Typography variant='body2' fontWeight={600}>
                      {activity.text}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {activity.time}
                    </Typography>
                  </Box>
                </Stack>
              ))}

              <Divider sx={{ my: 1 }} />

              <Paper
                variant='outlined'
                sx={{
                  p: 2,
                  borderRadius: 1,
                  background:
                    'linear-gradient(135deg, rgba(37,99,235,0.06) 0%, rgba(124,58,237,0.04) 100%)',
                }}
              >
                <Stack direction='row' spacing={1.5} alignItems='center'>
                  <Avatar
                    variant='rounded'
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.12),
                      color: 'primary.main',
                    }}
                  >
                    {renderDashboardIcon(overview.activityFeed.insight.iconKey)}
                  </Avatar>
                  <Box>
                    <Typography fontWeight={700}>
                      {overview.activityFeed.insight.title}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {overview.activityFeed.insight.message}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Stack>
          </DashboardCard>
        </Box>

        {/* Tables */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', xl: '2fr 1fr' },
            gap: 2,
          }}
        >
          <DashboardCard
            title={overview.tables.recentOrdersTitle}
            action={
              <Button size='small' endIcon={<ArrowOutwardRoundedIcon />}>
                View all
              </Button>
            }
          >
            <DashboardDataTable
              data={overview.tables.recentOrders}
              columns={orderColumns}
            />
          </DashboardCard>

          <DashboardCard title={overview.tables.lowStockItemsTitle}>
            <DashboardDataTable
              data={overview.tables.lowStockItems}
              columns={stockColumns}
            />
          </DashboardCard>
        </Box>
      </Stack>
    </Box>
  );
}
