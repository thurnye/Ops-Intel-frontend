import { Controller, type Control } from "react-hook-form";
import { TextField, type TextFieldProps } from "@mui/material";

type Props = {
  control: Control<any>;
  name: string;
} & Omit<TextFieldProps, "name" | "defaultValue">;

export function RHFTextField({ control, name, helperText, ...props }: Props) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <TextField
          {...props}
          {...field}
          value={field.value ?? ""}
          error={fieldState.invalid}
          helperText={fieldState.error?.message ?? helperText}
        />
      )}
    />
  );
}
