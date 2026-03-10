import { useState } from "react";
import { Alert, Box, Button, Card, CardContent, CircularProgress, Stack, TextField, Typography } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "@features/auth/hooks/useAuth";
import { sanitizeString } from "@shared/utils/security.utils";

export function LoginForm() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [emailOrUserName, setEmailOrUserName] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const onSubmit = async () => {
    setLocalError(null);
    const safeInput = sanitizeString(emailOrUserName);

    if (!safeInput) {
      setLocalError("Enter your email or username.");
      return;
    }

    if (password.trim().length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }

    const success = await login({ emailOrUserName: safeInput, password });
    if (success) {
      navigate("/dashboard", { replace: true });
    }
  };

  const displayError = localError ?? error;

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
                <Typography sx={{ fontSize: 18, fontWeight: 800 }}>O</Typography>
              </Box>
              <Typography variant="h5" sx={{ mb: 0.5 }}>Welcome back</Typography>
              <Typography sx={{ fontSize: 14, color: "#64748b" }}>
                Sign in to Ops-Intel
              </Typography>
            </Box>

            {displayError && <Alert severity="error" sx={{ borderRadius: 2.5 }}>{displayError}</Alert>}

            <TextField
              label="Email or Username"
              onChange={(e) => setEmailOrUserName(e.target.value)}
              value={emailOrUserName}
              fullWidth
              autoComplete="username"
            />
            <TextField
              label="Password"
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSubmit()}
              type="password"
              value={password}
              fullWidth
              autoComplete="current-password"
            />
            <Button onClick={onSubmit} variant="contained" size="large" fullWidth disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
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
