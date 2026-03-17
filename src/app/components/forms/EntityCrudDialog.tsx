import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { ZodType } from "zod";
import { RHFSelectField } from "@app/components/forms/RHFSelectField";
import { RHFSwitchField } from "@app/components/forms/RHFSwitchField";
import { RHFTextField } from "@app/components/forms/RHFTextField";

type Option = {
  label: string;
  value: string | number;
};

export type EntityFieldConfig = {
  name: string;
  label: string;
  kind?: "text" | "number" | "multiline" | "select" | "switch" | "date" | "datetime-local";
  options?: Option[];
  helperText?: string;
};

type Props<TValues extends Record<string, any>> = {
  open: boolean;
  title: string;
  description?: string;
  schema: ZodType<TValues>;
  defaultValues: TValues;
  fields: EntityFieldConfig[];
  submitLabel?: string;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (values: TValues) => Promise<void> | void;
};

export function EntityCrudDialog<TValues extends Record<string, any>>({
  open,
  title,
  description,
  schema,
  defaultValues,
  fields,
  submitLabel = "Save",
  submitting = false,
  onClose,
  onSubmit,
}: Props<TValues>) {
  const form = useForm<TValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    if (open) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form, open]);

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
        <form id="entity-crud-form" onSubmit={form.handleSubmit((values) => onSubmit(values))}>
          <Grid container spacing={2}>
            {fields.map((field) => {
              if (field.kind === "switch") {
                return (
                  <Grid key={field.name} size={{ xs: 12, md: 6 }}>
                    <RHFSwitchField control={form.control} name={field.name} label={field.label} />
                  </Grid>
                );
              }

              if (field.kind === "select") {
                return (
                  <Grid key={field.name} size={{ xs: 12, md: 6 }}>
                    <RHFSelectField
                      control={form.control}
                      name={field.name}
                      label={field.label}
                      options={field.options ?? []}
                      size="small"
                      fullWidth
                      helperText={field.helperText}
                    />
                  </Grid>
                );
              }

              return (
                <Grid key={field.name} size={{ xs: 12, md: field.kind === "multiline" ? 12 : 6 }}>
                  <RHFTextField
                    control={form.control}
                    name={field.name}
                    label={field.label}
                    size="small"
                    fullWidth
                    type={field.kind === "number" || field.kind === "date" || field.kind === "datetime-local" ? field.kind : "text"}
                    multiline={field.kind === "multiline"}
                    minRows={field.kind === "multiline" ? 3 : undefined}
                    helperText={field.helperText}
                    slotProps={
                      field.kind === "date" || field.kind === "datetime-local"
                        ? { inputLabel: { shrink: true } }
                        : undefined
                    }
                  />
                </Grid>
              );
            })}
          </Grid>
        </form>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button variant="outlined" onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" form="entity-crud-form" variant="contained" disabled={submitting}>
          {submitting ? "Saving..." : submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
