import { Controller, type Control } from "react-hook-form";
import { MenuItem, TextField, type TextFieldProps } from "@mui/material";

type Option = {
  label: string;
  value: string | number;
};

type Props = {
  control: Control<any>;
  name: string;
  options: Option[];
} & Omit<TextFieldProps, "name" | "defaultValue" | "select">;

export function RHFSelectField({ control, name, options, helperText, ...props }: Props) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <TextField
          {...props}
          {...field}
          select
          value={field.value ?? ""}
          error={fieldState.invalid}
          helperText={fieldState.error?.message ?? helperText}
        >
          {options.map((option) => (
            <MenuItem key={String(option.value)} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
}
