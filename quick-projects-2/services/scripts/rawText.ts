/**
 * Normalizes a text string to simplify searching and comparison.
 * - Converts numbers to strings;
 * - Removes accents (diacritics);
 * - Converts all characters to lowercase;
 * - Returns an empty string if the input is undefined, null, or empty.
 *
 * @param text The text or number to normalize.
 * @returns The normalized lowercase string without accents.
 */
export function rawText(text?: string | number): string {
  // Return empty string if falsy (undefined, null, 0, '')
  if (!text) return '';

  // Convert to string if the input is a number
  const str = typeof text === 'number' ? String(text) : text.trim();

  // Normalize accents and convert to lowercase
  return str
    .normalize('NFKD')                   // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, '')    // Remove diacritical marks (accents)
    .toLowerCase();                     // Convert to lowercase
}