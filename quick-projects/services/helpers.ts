/**
 * Returns a lowercase, accent-free version of the input.
 * - `null` or `undefined` returns an empty string.
 * - Numbers are converted to strings.
 * @param text Input: string, number, null, or undefined
 * @returns Processed string output
 */
export function rawText(text?: string | number): string {
  if (text == null) return "";
  if (typeof text === "number") return String(text);

  return text.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}
