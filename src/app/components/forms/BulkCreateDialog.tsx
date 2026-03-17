import { zodResolver } from "@hookform/resolvers/zod";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z, type ZodType } from "zod";
import { RHFTextField } from "@app/components/forms/RHFTextField";

type FormValues = {
  payload: string;
};

type Props<TValues extends Record<string, any>> = {
  open: boolean;
  title: string;
  description?: string;
  itemSchema: ZodType<TValues>;
  example: TValues;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (items: TValues[]) => Promise<void> | void;
};

export function BulkCreateDialog<TValues extends Record<string, any>>({
  open,
  title,
  description,
  itemSchema,
  example,
  submitting = false,
  onClose,
  onSubmit,
}: Props<TValues>) {
  const schema = useMemo(
    () =>
      z.object({
        payload: z
          .string()
          .min(2, "Provide a JSON array.")
          .superRefine((value, ctx) => {
            try {
              const parsed = JSON.parse(value);
              z.array(itemSchema).parse(parsed);
            } catch (error) {
              ctx.addIssue({
                code: "custom",
                message: error instanceof Error ? error.message : "Invalid JSON payload.",
              });
            }
          }),
      }),
    [itemSchema],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      payload: JSON.stringify([example], null, 2),
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        payload: JSON.stringify([example], null, 2),
      });
    }
  }, [example, form, open]);

  return (
    <Dialog open={open} onClose={submitting ? undefined : onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ pb: 1 }}>
        <Typography sx={{ fontSize: 22, fontWeight: 800 }}>{title}</Typography>
        {description ? (
          <Typography sx={{ mt: 0.75, fontSize: 14, color: "#64748b" }}>
            {description}
          </Typography>
        ) : null}
      </DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <Stack spacing={2}>
          <Alert icon={<InfoOutlinedIcon fontSize="inherit" />} severity="info">
            Paste a JSON array. Each object will be sent as one bulk-create item.
          </Alert>
          <form
            id="bulk-create-form"
            onSubmit={form.handleSubmit(async (values) => {
              const parsed = z.array(itemSchema).parse(JSON.parse(values.payload));
              await onSubmit(parsed);
            })}
          >
            <RHFTextField
              control={form.control}
              name="payload"
              label="Bulk JSON"
              fullWidth
              multiline
              minRows={16}
              sx={{
                "& .MuiInputBase-root": {
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  fontSize: 13,
                },
              }}
            />
          </form>
          <Box
            sx={{
              borderRadius: "18px",
              bgcolor: "#f8fafc",
              border: "1px solid #e2e8f0",
              p: 2,
            }}
          >
            <Typography sx={{ fontSize: 12, fontWeight: 800, color: "#475569", mb: 1 }}>
              Example Item
            </Typography>
            <Typography
              component="pre"
              sx={{
                m: 0,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: 12.5,
                color: "#334155",
              }}
            >
              {JSON.stringify(example, null, 2)}
            </Typography>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button variant="outlined" onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" form="bulk-create-form" variant="contained" disabled={submitting}>
          {submitting ? "Saving..." : "Save Bulk"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
