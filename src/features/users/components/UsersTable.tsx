import { Avatar, Chip, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import type { AppUser } from "@features/users/types/users.types";
import { roleLabel, roleColor, statusColor } from "@features/users/utils/users.utils";

type Props = { users: AppUser[] };

export function UsersTable({ users }: Props) {
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Last Active</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow hover key={user.id}>
              <TableCell>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Avatar sx={{ width: 28, height: 28, fontSize: 12, fontWeight: 700, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff" }}>{user.name.slice(0, 1)}</Avatar>
                  <RouterLink className="font-medium text-indigo-600 no-underline hover:text-indigo-800" to={`/users/${user.id}`}>{user.name}</RouterLink>
                </Stack>
              </TableCell>
              <TableCell><Chip label={roleLabel(user.role)} color={roleColor(user.role)} size="small" variant="outlined" sx={{ height: 22, fontSize: 11 }} /></TableCell>
              <TableCell sx={{ color: "#64748b" }}>{user.department}</TableCell>
              <TableCell><Chip label={user.status} color={statusColor(user.status)} size="small" variant="outlined" sx={{ height: 22, fontSize: 11, textTransform: "capitalize" }} /></TableCell>
              <TableCell sx={{ color: "#64748b", fontSize: 13 }}>{new Date(user.lastActive).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
