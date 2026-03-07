function parseBooleanFlag(value: string | boolean | undefined, defaultValue: boolean): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value !== 'string') {
    return defaultValue;
  }

  const normalized = value.trim().toLowerCase();
  if (normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === 'on') {
    return true;
  }
  if (normalized === 'false' || normalized === '0' || normalized === 'no' || normalized === 'off') {
    return false;
  }

  return defaultValue;
}

export const FEATURE_MAC_DOWNLOAD_ENABLED = parseBooleanFlag(
  import.meta.env.VITE_FEATURE_MAC_DOWNLOAD_ENABLED,
  false
);
