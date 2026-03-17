import type { SxProps, Theme } from "@mui/material/styles";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import PrecisionManufacturingRoundedIcon from "@mui/icons-material/PrecisionManufacturingRounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import WarehouseRoundedIcon from "@mui/icons-material/WarehouseRounded";
import Groups2RoundedIcon from "@mui/icons-material/Groups2Rounded";
import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import type { DashboardIconKey } from "@features/dashboard/types/dashboard.types";

type IconProps = {
  sx?: SxProps<Theme>;
};

export function renderDashboardIcon(iconKey: DashboardIconKey, props?: IconProps) {
  switch (iconKey) {
    case "currency":
      return <AttachMoneyRoundedIcon sx={props?.sx} />;
    case "orders":
      return <ReceiptLongRoundedIcon sx={props?.sx} />;
    case "inventory":
      return <Inventory2RoundedIcon sx={props?.sx} />;
    case "shipments":
      return <LocalShippingRoundedIcon sx={props?.sx} />;
    case "alerts":
      return <WarningAmberRoundedIcon sx={props?.sx} />;
    case "production":
      return <PrecisionManufacturingRoundedIcon sx={props?.sx} />;
    case "shopping":
      return <ShoppingBagRoundedIcon sx={props?.sx} />;
    case "warehouse":
      return <WarehouseRoundedIcon sx={props?.sx} />;
    case "groups":
      return <Groups2RoundedIcon sx={props?.sx} />;
    case "check":
      return <FactCheckRoundedIcon sx={props?.sx} />;
    case "trend":
      return <TrendingUpRoundedIcon sx={props?.sx} />;
    case "task":
      return <TaskAltRoundedIcon sx={props?.sx} />;
    case "notifications":
      return <NotificationsNoneRoundedIcon sx={props?.sx} />;
    default:
      return <TaskAltRoundedIcon sx={props?.sx} />;
  }
}
