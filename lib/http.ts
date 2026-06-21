/** Returns the URL if it is a non-empty, valid absolute URL, else null. */
export function readValidUrl(value: string | undefined): string | null {
  if (!value) {
    return null;
  }

  try {
    new URL(value);

    return value;
  } catch {
    return null;
  }
}
