import { Controller, type Control } from "react-hook-form";
import { FormControlLabel, FormHelperText, Switch } from "@mui/material";

type Props = {
  control: Control<any>;
  name: string;
  label: string;
};

export function RHFSwitchField({ control, name, label }: Props) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div>
          <FormControlLabel
            control={<Switch checked={Boolean(field.value)} onChange={(_, checked) => field.onChange(checked)} />}
            label={label}
          />
          {fieldState.error ? <FormHelperText error>{fieldState.error.message}</FormHelperText> : null}
        </div>
      )}
    />
  );
}
