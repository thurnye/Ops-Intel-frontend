import { useState } from "react";
import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAppDispatch } from "@app/hooks/app.hooks";
import { setSession, startAuth } from "@features/auth/redux/slices/auth.slice";
import { mockSession } from "@features/auth/mock/auth.mock";
import { isValidEmail, sanitizeString } from "@shared/utils/security.utils";

export function LoginForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("ops.supervisor@canart.local");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = () => {
    const safeEmail = sanitizeString(email);

    if (!isValidEmail(safeEmail)) {
      setError("Enter a valid email address.");
      return;
    }

    if (password.trim().length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    dispatch(startAuth());
    dispatch(setSession({ ...mockSession, user: { ...mockSession.user, email: safeEmail } }));
    localStorage.setItem("auth_token", mockSession.token);
    navigate("/dashboard", { replace: true });
  };

  return (
    <Box className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md" sx={{ boxShadow: "0 4px 24px rgba(15, 23, 42, 0.08)" }}>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={3}>
            <Box className="text-center">
              <Box
                className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl text-white"
                sx={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
              >
                <Typography sx={{ fontSize: 18, fontWeight: 800 }}>F</Typography>
              </Box>
              <Typography variant="h5" sx={{ mb: 0.5 }}>Welcome back</Typography>
              <Typography sx={{ fontSize: 14, color: "#64748b" }}>
                Sign in to Finance Ops Console
              </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ borderRadius: 2.5 }}>{error}</Alert>}

            <TextField
              label="Work email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              fullWidth
            />
            <TextField
              label="Password"
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              value={password}
              fullWidth
            />
            <Button onClick={onSubmit} variant="contained" size="large" fullWidth>
              Continue
            </Button>

            <Typography className="text-center" sx={{ fontSize: 13, color: "#64748b" }}>
              <RouterLink className="font-medium text-indigo-600 no-underline hover:text-indigo-800" to="/forgot-password">
                Forgot password?
              </RouterLink>
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
