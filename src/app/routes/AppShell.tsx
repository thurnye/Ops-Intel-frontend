import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Collapse,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PrecisionManufacturingOutlinedIcon from "@mui/icons-material/PrecisionManufacturingOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import FiberManualRecordRoundedIcon from "@mui/icons-material/FiberManualRecordRounded";
import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@features/auth/hooks/useAuth";

const drawerWidth = 260;
const appBarHeight = 56;

interface NavSection {
  group: string;
  items: {
    label: string;
    to: string;
    icon: React.ReactNode;
    children?: { label: string; to: string }[];
  }[];
}

const navSections: NavSection[] = [
  {
    group: "Operations",
    items: [
      { label: "Dashboard", to: "/dashboard", icon: <DashboardOutlinedIcon fontSize="small" /> },
      {
        label: "Orders",
        to: "/orders",
        icon: <ReceiptLongOutlinedIcon fontSize="small" />,
        children: [
          { label: "Overview", to: "/orders" },
          { label: "Customer Contacts", to: "/orders/customer-contacts" }
        ]
      },
      {
        label: "Production",
        to: "/production",
        icon: <PrecisionManufacturingOutlinedIcon fontSize="small" />,
        children: [
          { label: "Overview", to: "/production" },
          { label: "Routings", to: "/production/routings" },
          { label: "Labor Logs", to: "/production/labor-logs" },
          { label: "Machines", to: "/production/machines" }
        ]
      },
      {
        label: "Scheduling",
        to: "/scheduling",
        icon: <CalendarMonthOutlinedIcon fontSize="small" />,
        children: [
          { label: "Overview", to: "/scheduling" },
          { label: "Shifts", to: "/scheduling/shifts" },
          { label: "Calendars", to: "/scheduling/calendars" },
          { label: "Dispatch", to: "/scheduling/dispatch" }
        ]
      },
      {
        label: "Inventory",
        to: "/inventory",
        icon: <Inventory2OutlinedIcon fontSize="small" />,
        children: [
          { label: "Overview", to: "/inventory" },
          { label: "Catalogs", to: "/inventory/catalogs" },
          { label: "Stock Movements", to: "/inventory/movements" },
          { label: "Brands", to: "/inventory/brands" },
          { label: "Warehouses", to: "/inventory/warehouses" },
          { label: "Suppliers", to: "/inventory/suppliers" }
        ]
      },
      {
        label: "Shipments",
        to: "/shipments",
        icon: <LocalShippingOutlinedIcon fontSize="small" />,
        children: [
          { label: "Overview", to: "/shipments" },
          { label: "Shipments", to: "/shipments/records" },
          { label: "Carriers", to: "/shipments/carriers" },
          { label: "Lanes", to: "/shipments/lanes" }
        ]
      }
    ]
  },
  {
    group: "Insights",
    items: [
      { label: "Reports", to: "/reports", icon: <AssessmentOutlinedIcon fontSize="small" /> },
      { label: "Analytics", to: "/analytics", icon: <InsightsOutlinedIcon fontSize="small" /> },
      { label: "Alerts", to: "/alerts", icon: <NotificationsActiveOutlinedIcon fontSize="small" /> }
    ]
  },
  {
    group: "Administration",
    items: [
      { label: "Users", to: "/users", icon: <PeopleOutlineOutlinedIcon fontSize="small" /> },
      { label: "Settings", to: "/settings", icon: <SettingsOutlinedIcon fontSize="small" /> }
    ]
  }
];

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const signOut = () => {
    logout();
  };

  const navContent = (
    <Box className="flex h-full flex-col bg-white">
      {/* Search hint */}
      <Box className="mx-4 mb-3 mt-4 flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
        <SearchOutlinedIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
        <Typography sx={{ fontSize: 12, color: "#94a3b8" }}>Search...</Typography>
        <Typography className="ml-auto rounded border border-slate-200 px-1.5 py-0.5" sx={{ fontSize: 10, color: "#94a3b8" }}>
          /
        </Typography>
      </Box>

      {/* Nav */}
      <Box className="flex-1 overflow-y-auto px-3">
        {navSections.map((section) => (
          <Box key={section.group} sx={{ mb: 2 }}>
            <Typography sx={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#94a3b8", px: 1.5, mb: 1 }}>
              {section.group}
            </Typography>
            <List disablePadding>
              {section.items.map((item) => (
                <Box key={item.label}>
                  <ListItemButton
                    component={NavLink}
                    onClick={() => setMobileOpen(false)}
                    sx={{
                      borderRadius: "12px",
                      mb: item.children?.length ? 0.5 : "2px",
                      px: 1.5,
                      py: 1,
                      color: "#64748b",
                      transition: "all 0.15s ease",
                      "&:hover": {
                        bgcolor: "#f8fafc",
                        color: "#0f172a"
                      },
                      "&.active": {
                        bgcolor: "#eef2ff",
                        color: "#4f46e5",
                        "& .MuiListItemIcon-root": { color: "#4f46e5" }
                      }
                    }}
                    to={item.to}
                    end={!item.children?.length}
                  >
                    <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      slotProps={{ primary: { sx: { fontSize: 13, fontWeight: 600 } } }}
                    />
                  </ListItemButton>
                  {item.children?.length ? (
                    <Collapse in={location.pathname.startsWith(item.to)} timeout="auto" unmountOnExit={false}>
                      <List disablePadding sx={{ pl: 5, pr: 1, pb: 0.5 }}>
                        {item.children.map((child) => (
                          <ListItemButton
                            component={NavLink}
                            end
                            key={child.to}
                            onClick={() => setMobileOpen(false)}
                            sx={{
                              borderRadius: "10px",
                              minHeight: 34,
                              px: 1.25,
                              color: "#64748b",
                              "&:hover": { bgcolor: "#f8fafc", color: "#0f172a" },
                              "&.active": {
                                bgcolor: "#eff6ff",
                                color: "#1d4ed8"
                              }
                            }}
                            to={child.to}
                          >
                            <ListItemIcon sx={{ minWidth: 22, color: "inherit" }}>
                              <FiberManualRecordRoundedIcon sx={{ fontSize: 8 }} />
                            </ListItemIcon>
                            <ListItemText primary={child.label} slotProps={{ primary: { sx: { fontSize: 12.5, fontWeight: 500 } } }} />
                          </ListItemButton>
                        ))}
                      </List>
                    </Collapse>
                  ) : null}
                </Box>
              ))}
            </List>
          </Box>
        ))}
      </Box>

      {/* Bottom user section */}
      <Box className="mx-3 mb-4 flex items-center gap-3 rounded-xl border border-slate-100 p-3">
        <Avatar
          sx={{
            width: 32,
            height: 32,
            fontSize: 13,
            fontWeight: 700,
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            color: "#fff"
          }}
        >
          {user?.profile?.firstName?.slice(0, 1) ?? "U"}
        </Avatar>
        <Box className="flex-1 overflow-hidden">
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {user?.profile ? `${user.profile.firstName} ${user.profile.lastName}` : "User"}
          </Typography>
          <Typography sx={{ fontSize: 11, color: "#94a3b8" }}>Operator</Typography>
        </Box>
        <IconButton onClick={signOut} size="small" sx={{ color: "#94a3b8", "&:hover": { color: "#f87171", bgcolor: "#fef2f2" } }}>
          <LogoutOutlinedIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>
    </Box>
  );

  return (
    <Box className="min-h-screen bg-slate-50" sx={{ display: "flex", flexDirection: "column" }}>
      {/* Full-width top bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #e2e8f0"
        }}
      >
        <Toolbar className="flex justify-between" sx={{ minHeight: `${appBarHeight}px !important` }}>
          <Box className="flex items-center gap-3">
            <IconButton
              className="md:!hidden"
              onClick={() => setMobileOpen(true)}
              sx={{ color: "#0f172a", borderRadius: 2 }}
            >
              <MenuIcon />
            </IconButton>

            {/* Brand */}
            <Box className="flex items-center gap-2.5">
              <Box
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
                sx={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
              >
                <Typography sx={{ fontSize: 13, fontWeight: 800 }}>O</Typography>
              </Box>
              <Box className="hidden md:block">
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                  Ops-Intel
                </Typography>
                <Typography sx={{ fontSize: 10, color: "#94a3b8", fontWeight: 500 }}>
                 v1.0.0
                </Typography>
              </Box>
            </Box>

            {/* Divider */}
            <Box className="mx-1 hidden h-6 w-px bg-slate-200 md:block" />

            {/* <Typography sx={{ fontWeight: 600, fontSize: "0.95rem", color: "#0f172a", letterSpacing: "-0.01em" }}>
              {activeLabel}
            </Typography> */}
          </Box>

          <Box className="flex items-center gap-1">
            <IconButton
              sx={{
                borderRadius: 2.5,
                color: "#94a3b8",
                "&:hover": { backgroundColor: "#ede9fe", color: "#6366f1" }
              }}
            >
              <Badge
                color="error"
                variant="dot"
                sx={{ "& .MuiBadge-dot": { width: 8, height: 8, borderRadius: "50%", border: "2px solid #fff" } }}
              >
                <NotificationsNoneOutlinedIcon sx={{ fontSize: 20 }} />
              </Badge>
            </IconButton>
            <Avatar
              sx={{
                width: 30,
                height: 30,
                fontSize: 12,
                fontWeight: 700,
                bgcolor: "#f1f5f9",
                color: "#475569",
                border: "1px solid #e2e8f0",
                ml: 0.5
              }}
            >
              {user?.profile?.firstName?.slice(0, 1) ?? "U"}
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Body below the app bar */}
      <Box sx={{ display: "flex", flex: 1, mt: `${appBarHeight}px` }}>
        {/* Sidebar */}
        <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
          <Drawer
            ModalProps={{ keepMounted: true }}
            onClose={() => setMobileOpen(false)}
            open={mobileOpen}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": { width: drawerWidth, border: "none", top: `${appBarHeight}px`, height: `calc(100% - ${appBarHeight}px)` }
            }}
            variant="temporary"
          >
            {navContent}
          </Drawer>
          <Drawer
            open
            sx={{
              display: { xs: "none", md: "block" },
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                borderRight: "1px solid #e2e8f0",
                boxSizing: "border-box",
                top: `${appBarHeight}px`,
                height: `calc(100% - ${appBarHeight}px)`,
                bgcolor: "#fff"
              }
            }}
            variant="permanent"
          >
            {navContent}
          </Drawer>
        </Box>

        {/* Main content */}
        <Box
          component="main"
          sx={{ flexGrow: 1, minHeight: `calc(100vh - ${appBarHeight}px)` }}
          className="p-4 md:p-6"
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
