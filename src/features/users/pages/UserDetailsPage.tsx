import { Avatar, Box, Card, CardContent, Chip, Container, Stack, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useAppSelector } from "@app/hooks/app.hooks";
import { roleLabel, roleColor, statusColor } from "@features/users/utils/users.utils";

export function UserDetailsPage() {
  const { userId } = useParams<{ userId: string }>();
  const user = useAppSelector((s) => s.users.users.find((u) => u.id === userId));

  if (!user) return <Typography variant="h6" color="text.secondary">User not found</Typography>;

  return (
    <Container maxWidth={false} disableGutters className="space-y-5">
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar sx={{ width: 48, height: 48, fontSize: 20, fontWeight: 700, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff" }}>{user.name.slice(0, 1)}</Avatar>
        <Box>
          <Typography variant="h4">{user.name}</Typography>
          <Typography sx={{ fontSize: 14, color: "#64748b" }}>{user.email}</Typography>
        </Box>
      </Stack>
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
            <Box>
              <Typography sx={{ fontSize: 12, color: "#94a3b8", mb: 0.25 }}>Role</Typography>
              <Chip label={roleLabel(user.role)} color={roleColor(user.role)} size="small" variant="outlined" />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 12, color: "#94a3b8", mb: 0.25 }}>Department</Typography>
              <Typography sx={{ fontWeight: 600 }}>{user.department}</Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: 12, color: "#94a3b8", mb: 0.25 }}>Status</Typography>
              <Chip label={user.status} color={statusColor(user.status)} size="small" variant="outlined" sx={{ textTransform: "capitalize" }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 12, color: "#94a3b8", mb: 0.25 }}>Last Active</Typography>
              <Typography sx={{ fontWeight: 600 }}>{new Date(user.lastActive).toLocaleString()}</Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
