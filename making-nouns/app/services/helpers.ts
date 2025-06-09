export function capitalizeFirstLetter(str: string): string {
  if (!str) return ""; // trata string vazia ou null
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getRandomIndexes(length: number): number[] {
  if (length <= 0) return [];
  if (length === 1) return [0];
  const indexes = Array.from({ length }, (_, i) => i);
  for (let i = indexes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
  }
  return indexes;
}

export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function getShuffledColors(count: number): string[] {
  const colors = [
    "magenta", "red", "volcano", "orange", "gold",
    "lime", "green", "cyan", "blue", "geekblue", "purple"
  ];

  if (count > colors.length) {
    throw new Error(`Requested ${count} colors, but only ${colors.length} are available.`);
  }

  return shuffleArray(colors).slice(0, count);
}
