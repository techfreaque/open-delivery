export function parseError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

export function format<T = Record<string, string>>(
  strings: string[],
  values: T,
): string[] {
  return strings.map((part) =>
    part.replace(
      /{(\w+)}/g,
      (_, key: string) => (values as Record<string, string>)[key] || "",
    ),
  );
}
