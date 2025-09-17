import { IRbcItem } from "@/interfaces";
import { notification } from "antd";
import { createHash } from "crypto";

export const fetcher = (url: string) => fetch(url).then(res => res.json());

export const getRelationProp = (id?: string) => id ? { relation: [{ id }] } : undefined;

export const generateUniqueKey = (): string =>
  (new Date().toISOString().replace(/[-:.TZ]/g, "") +
    Math.random().toString(36).slice(2, 8)).toUpperCase();

export const parseStringArray = (str: string): unknown[] | null => {
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export function hashIRItem(item: IRbcItem): string {
  const str = [
    item.AccountType,
    item.TransactionDate,
    item.Description1,
    item.Description2,
    item.Balance.toFixed(2),
    item.Total.toFixed(2),
  ].join("|"); // separador confiável

  return createHash("sha256").update(str).digest("hex");
}

export default function notifyAxiosError(err: unknown, message: string, title = "ERROR"): void {
  const errorMessage = getErrorMessage(err);

  notification.error({
    message: title,
    description: [message, errorMessage].filter(Boolean).join(": "),
    duration: 15,
  });
}

export const renderDate = (d: string): string => {
  if (!d) return "";
  const date = new Date(d);
  const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "long", year: "2-digit" };
  const formattedDate = date.toLocaleDateString("en-GB", options);
  const weekday = date.toLocaleDateString("en-GB", { weekday: "short" });
  return `${formattedDate} (${weekday})`;
};

/**
 * Extrai a melhor mensagem possível de um erro desconhecido (Axios, Notion, Error padrão, etc)
 */
export function getErrorMessage(error: unknown): string {
  if (!error) return "Unknown error";

  if (typeof error === "object" && error !== null) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const err = error as any;

    // Caso comum com Axios
    if (err.response?.data?.error) return err.response.data.error;
    if (err.response?.data?.message) return err.response.data.message;

    // Notion API ou estruturas aninhadas
    if (err.response?.data?.error?.message) return err.response.data.error.message;

    // Erro padrão em err.error.message
    if (err.error?.message) return err.error.message;

    // Axios fallback
    if (typeof err.response?.statusText === "string") return err.response.statusText;

    // Novo: tenta parsear body se for string com JSON
    if (typeof err.body === "string") {
      try {
        const parsed = JSON.parse(err.body);
        if (parsed?.message) return parsed.message;
      } catch {
        // ignora se não for JSON válido
      }
    }

    // Error padrão com propriedade message
    if ("message" in err && typeof err.message === "string") return err.message;
  }

  if (error instanceof Error && typeof error.message === "string") {
    return error.message;
  }

  // Fallback final
  return String(error);
}


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
  if (!text) return "";

  // Convert to string if the input is a number
  const str = typeof text === "number" ? String(text) : text.trim();

  // Normalize accents and convert to lowercase
  return str
    .normalize("NFKD")                   // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, "")    // Remove diacritical marks (accents)
    .toLowerCase();                     // Convert to lowercase
}

/**
 * Sorting utilities that push `undefined` values to the end.
 *
 * Examples:
 * - Alphabetical: ['b', undefined, 'a'] → ['a', 'b', undefined]
 * - Numerical:    [3, undefined, 1] → [1, 3, undefined]
 * - Boolean:      [false, true, undefined] → [true, false, undefined]
 */
export const sorter = {
  /**
   * Sorts strings alphabetically, placing `undefined` values last.
   */
  alphabetically: (a?: string, b?: string): number => {
    if (a === undefined && b !== undefined) return 1;
    if (a !== undefined && b === undefined) return -1;
    return (a || "").localeCompare(b || "");
  },

  /**
   * Sorts numbers in ascending order, placing `undefined` values last.
   */
  numerically: (a?: number, b?: number): number => {
    if (a === undefined && b !== undefined) return 1;
    if (a !== undefined && b === undefined) return -1;
    return (a ?? -Infinity) - (b ?? -Infinity);
  },

  /**
   * Sorts booleans with `true` first, `false` second, and `undefined` last.
   */
  booleanally: (a?: boolean, b?: boolean): number => {
    if (a === undefined && b !== undefined) return 1;
    if (a !== undefined && b === undefined) return -1;
    return Number(b ?? false) - Number(a ?? false);
  },
};