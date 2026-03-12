import { useEffect, useState } from "react";
import { Alert, Chip, Stack } from "@mui/material";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import RouteOutlinedIcon from "@mui/icons-material/RouteOutlined";
import SwapHorizOutlinedIcon from "@mui/icons-material/SwapHorizOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import { OperationsHubPage } from "@app/components/OperationsHubPage";
import { shipmentsApi } from "@features/shipments/services/shipments.api.service";
import { getApiData, getErrorMessage } from "@shared/utils/asyncThunk.utils";

export function ShipmentsOverviewPage() {
  const [stats, setStats] = useState({ shipments: 0, carriers: 0, lanes: 0, inTransit: 0 });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void Promise.all([
      shipmentsApi.getSummary(),
      shipmentsApi.getCarriersSummary(),
      shipmentsApi.getAddressesSummary()
    ])
      .then(([summaryResponse, carriersSummaryResponse, addressesSummaryResponse]) => {
        const summary = getApiData(summaryResponse, null as never);
        const carriersSummary = getApiData(carriersSummaryResponse, null as never);
        const addressesSummary = getApiData(addressesSummaryResponse, null as never);
        setStats({
          shipments: summary.totalShipments,
          carriers: carriersSummary.totalCarriers,
          lanes: addressesSummary.totalAddresses,
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
        highlights={[
          `${stats.inTransit} shipments currently moving`,
          `${stats.carriers} carriers connected to execution`,
          `${stats.lanes} registered shipment addresses in the lane registry`
        ]}
        stats={[
          { label: "Shipments", value: stats.shipments, tone: "#6366f1", description: "Total shipment records currently in the operational network.", icon: <LocalShippingOutlinedIcon sx={{ fontSize: 18 }} /> },
          { label: "In Transit", value: stats.inTransit, tone: "#2563eb", description: "Loads or parcels moving through the delivery lifecycle.", icon: <SwapHorizOutlinedIcon sx={{ fontSize: 18 }} /> },
          { label: "Carriers", value: stats.carriers, tone: "#16a34a", description: "Carrier partners available for execution and service assignment.", icon: <TimelineOutlinedIcon sx={{ fontSize: 18 }} /> },
          { label: "Lanes", value: stats.lanes, tone: "#f59e0b", description: "Origin and destination addresses available to build shipment lanes.", icon: <RouteOutlinedIcon sx={{ fontSize: 18 }} /> }
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
