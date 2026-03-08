import { Box, Card, CardContent, Container, Typography } from "@mui/material";
import { UsersTable } from "@features/users/components/UsersTable";
import { useUsers } from "@features/users/hooks/useUsers";

export function UsersListPage() {
  const { filteredUsers } = useUsers();
  return (
    <Container maxWidth={false} disableGutters className="space-y-6">
      <Box>
        <Typography variant="h4">Users</Typography>
        <Typography sx={{ fontSize: 14, color: "#64748b", mt: 0.5 }}>Manage user accounts, roles, and access levels</Typography>
      </Box>
      <Card><CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}><UsersTable users={filteredUsers} /></CardContent></Card>
    </Container>
  );
}
