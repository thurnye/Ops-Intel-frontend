import { useEffect, useState } from "react";
import { Alert, Chip, Stack } from "@mui/material";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import RouteOutlinedIcon from "@mui/icons-material/RouteOutlined";
import { OperationsHubPage } from "@app/components/OperationsHubPage";
import { shipmentsApi } from "@features/shipments/services/shipments.api.service";
import { getApiData, getErrorMessage, getPagedItems } from "@shared/utils/asyncThunk.utils";

export function ShipmentsOverviewPage() {
  const [stats, setStats] = useState({ shipments: 0, carriers: 0, lanes: 0, inTransit: 0 });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void Promise.all([
      shipmentsApi.getSummary(),
      shipmentsApi.listCarriers({ pageNumber: 1, pageSize: 100 }),
      shipmentsApi.searchAddresses({ take: 100 })
    ])
      .then(([summaryResponse, carriersResponse, lanesResponse]) => {
        const summary = getApiData(summaryResponse, null as never);
        setStats({
          shipments: summary.totalShipments,
          carriers: getPagedItems(carriersResponse).length,
          lanes: getApiData(lanesResponse, []).length,
          inTransit: summary.inTransitShipments
        });
      })
      .catch((loadError) => setError(getErrorMessage(loadError, "Failed to load shipment overview.")));
  }, []);

  return (
    <Stack spacing={3}>
      {error ? <Alert severity="error">{error}</Alert> : null}
      <OperationsHubPage
        eyebrow="Shipment Control"
        title="Shipment Overview"
        description="Track outbound flow, carrier readiness, and lane coverage from one control surface. Use this section to move between shipment execution, carrier management, and the address or lane registry."
        stats={[
          { label: "Shipments", value: stats.shipments, tone: "#6366f1" },
          { label: "In Transit", value: stats.inTransit, tone: "#2563eb" },
          { label: "Carriers", value: stats.carriers, tone: "#16a34a" },
          { label: "Lanes", value: stats.lanes, tone: "#f59e0b" }
        ]}
        actions={[
          { title: "Shipment Execution", description: "Move into the shipment register to manage priority, tracking, and package progress.", to: "/shipments/records", cta: "Open Shipments" },
          { title: "Carrier Network", description: "Review the carrier portfolio and the active service catalog used for delivery promises.", to: "/shipments/carriers", cta: "Open Carriers" },
          { title: "Lane Registry", description: "Browse the origin and destination address library that defines the lane footprint for shipping operations.", to: "/shipments/lanes", cta: "Open Lanes" },
          { title: "Create Shipment", description: "Launch the shipment form to create a new outbound or transfer record.", to: "/shipments/new", cta: "New Shipment" }
        ]}
      />
      <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
        <Chip icon={<LocalShippingOutlinedIcon />} label="Carrier-backed operations" />
        <Chip icon={<TimelineOutlinedIcon />} label="Exception aware" />
        <Chip icon={<RouteOutlinedIcon />} label="Address-driven lanes" />
      </Stack>
    </Stack>
  );
}
