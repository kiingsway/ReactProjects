import { TypeCSV } from "@/components/Expenses/interfaces";
import { Page } from "@/interfaces";
import dayjs from "dayjs";
import { DateTime } from "luxon";
import Papa from "papaparse";
import hash from "object-hash";

const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
const numberRegex = /^-?\d+(\.\d+)?$/;

export const swrNoRefresh = { refreshInterval: 0, revalidateOnFocus: false, revalidateOnReconnect: false, refreshWhenHidden: false, };

export const getPageUrl = (pageId: string): string => `/api/page/${pageId}`;
export const getDBUrl = (dbID: string): string => `/api/database/${dbID}`;

export const removeDuplicates = (arr: string[]): string[] => Array.from(new Set(arr));

const generateObjectKey = (obj: Record<string, string | number>): string => hash(obj);

export function friendlyDate(stringDate: string): string {
  try {
    const dt = DateTime.fromISO(stringDate);
    if (!dt.isValid) throw new Error("Invalid date");

    const now = DateTime.now().startOf("day");
    const target = dt.startOf("day");

    const diffDays = target.diff(now, "days").days;

    const timeFormatted = dt.toFormat("HH:mm");

    if (diffDays === 0) return `Today at ${timeFormatted}`;
    if (diffDays === -1) return `Yesterday at ${timeFormatted}`;
    if (diffDays === 1) return `Tomorrow at ${timeFormatted}`;

    if (dt.year !== now.year) return dt.toFormat("dd/MM/yyyy HH:mm");
    return dt.toFormat("dd/MM HH:mm");
  } catch (e: unknown) {
    let error: string = "Unknown error";
    if (e instanceof Error) error = e.message;
    throw new Error(`Error converting data: ${error}`);
  }
}

export function renderNotionDate(start: string, end?: string): string {

  const dmy = "DD/MM/YYYY";
  const hm = "HH:mm";
  const dmyhm = `${dmy} ${hm}`;

  const formatDate = (d: string): string => dayjs(d).format(d.includes("T") ? dmyhm : dmy);

  const startFormatted = formatDate(start);

  if (!end) return startFormatted;

  const endFormatted = formatDate(end);
  const sameDay = dayjs(start).isSame(end, "day");

  if (sameDay) {
    const startHasTime = start.includes("T");
    const endHasTime = end.includes("T");

    if (startHasTime && endHasTime) return `${dayjs(start).format(dmyhm)} → ${dayjs(end).format(hm)}`;

    return dayjs(start).format(dmy);
  }

  return `${startFormatted} → ${endFormatted}`;
}

export function getRelationArrayFromProperties(pages: Page[]): string[] {

  if (!pages.length) return [];

  const arr: string[] = [];

  console.log("pages:", pages);
  for (const page of pages) {
    for (const key in page.properties) {
      const prop = page.properties[key];
      if (prop.type === "relation") arr.push(...prop.relation.map(r => r.id));
    }
  }

  return arr;
}

/**
 * Extrai a melhor mensagem possível de um erro desconhecido (Axios, Notion, Error padrão, etc)
 */
export function getErrorMessage(error: unknown): string {
  if (!error) return "Unknown error";

  if (typeof error === "object" && error !== null) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const err = error as any;

    // Axios comum
    if (err.response?.data?.message) return err.response.data.message;

    // Notion API ou outras APIs aninhadas
    if (err.response?.data?.error?.message) return err.response.data.error.message;

    // Possível estrutura com `error.message`
    if (err.error?.message) return err.error.message;

    // Axios fallback
    if (typeof err.response?.statusText === "string") return err.response.statusText;

    // Error padrão
    if ("message" in err && typeof err.message === "string") return err.message;
  }

  if (error instanceof Error && typeof error.message === "string") return error.message;

  // Fallback genérico
  return String(error);
}

/**
 * Converte um CSV string para JSON e formata datas no formato M/D/YYYY para DD/MM/YYYY.
 */
export function parseCsvWithTypes(csvText: string): TypeCSV[] {
  const { data, errors } = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: h => h.trim(),
  });

  if (errors.length) throw new Error(`Erro ao processar o CSV: ${errors[0].message}`);

  return data.map((row) => {
    const parsed: Record<string, string | number> = {};

    for (const [key, raw] of Object.entries(row)) {
      const val = raw?.trim();
      if (dateRegex.test(val)) {
        const [, m, d, y] = val.match(dateRegex)!;
        parsed[key] = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
      } else if (numberRegex.test(val)) {
        parsed[key] = parseFloat(val);
      } else {
        parsed[key] = val;
      }
    }

    return { key: generateObjectKey(parsed), ...parsed } as TypeCSV;
  });
}

/**
 * Sorter padrão: ordena strings e números corretamente (A–Z, 0–9).
 */
export function defaultSorter(a: TypeCSV, b: TypeCSV, key: string): number {
  const [aVal, bVal] = [a[key], b[key]];

  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  const aStr = String(aVal).trim();
  const bStr = String(bVal).trim();

  // Se ambos forem datas ISO válidas, comparar como data
  if (isoDateRegex.test(aStr) && isoDateRegex.test(bStr)) {
    const aDate = new Date(aStr).getTime();
    const bDate = new Date(bStr).getTime();
    return aDate - bDate;
  }

  // Comparação numérica se ambos forem números válidos
  const aNum = typeof aVal === "number" ? aVal : parseFloat(aStr);
  const bNum = typeof bVal === "number" ? bVal : parseFloat(bStr);
  const [aIsNumber, bIsNumber] = [!isNaN(aNum), !isNaN(bNum)];

  if (aIsNumber && bIsNumber) return aNum - bNum;

  // Fallback para string com ordenação alfanumérica
  return aStr.localeCompare(bStr, undefined, { numeric: true, sensitivity: "base" });
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