export function normalizeImportHeader(value: string) {
  return value.replace(/[^a-z0-9]+/gi, "").toLowerCase();
}

export function toImportString(value: unknown) {
  return typeof value === "string"
    ? value.trim()
    : value == null
      ? ""
      : String(value).trim();
}

export function buildImportHeaderMap(headerRow: string[]) {
  return headerRow.reduce<Record<string, number>>((accumulator, header, index) => {
    accumulator[normalizeImportHeader(header)] = index;
    return accumulator;
  }, {});
}

export function getImportCellValue(
  row: unknown[],
  headerMap: Record<string, number>,
  aliases: string[],
) {
  for (const alias of aliases) {
    const index = headerMap[normalizeImportHeader(alias)];
    if (index != null) {
      return row[index];
    }
  }

  return undefined;
}

export function parseImportBoolean(value: unknown, fallback = false) {
  if (typeof value === "boolean") {
    return value;
  }

  const normalized = toImportString(value).toLowerCase();
  if (!normalized) {
    return fallback;
  }

  return ["true", "yes", "y", "1", "active"].includes(normalized);
}

export function parseImportNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  const normalized = toImportString(value);
  if (!normalized) {
    return fallback;
  }

  const parsed = Number(normalized.replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function parseImportEnum<TEnum extends Record<string, string | number>>(
  value: unknown,
  enumMap: TEnum,
  fallback: TEnum[keyof TEnum],
) {
  if (typeof value === "number" && Object.values(enumMap).includes(value)) {
    return value as TEnum[keyof TEnum];
  }

  const normalized = toImportString(value);
  if (!normalized) {
    return fallback;
  }

  const numeric = Number(normalized);
  if (Number.isFinite(numeric) && Object.values(enumMap).includes(numeric)) {
    return numeric as TEnum[keyof TEnum];
  }

  const matchedEntry = Object.entries(enumMap).find(([key]) =>
    normalizeImportHeader(key) === normalizeImportHeader(normalized),
  );

  return (matchedEntry?.[1] as TEnum[keyof TEnum] | undefined) ?? fallback;
}
