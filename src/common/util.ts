export function ensureDefined<T>(value: T | undefined): T {
  if (value === undefined) {
    throw new Error("Value should not be undefined");
  }
  return value;
}
