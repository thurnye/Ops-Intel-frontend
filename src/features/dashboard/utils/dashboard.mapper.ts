import type {
  DashboardOverviewApiResponse,
  DashboardOverviewData,
} from '@features/dashboard/types/dashboard.types';

export function mapDashboardOverviewResponse(
  response: DashboardOverviewApiResponse,
): DashboardOverviewData {
  return response;
}
