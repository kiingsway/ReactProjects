import { Page } from "@/interfaces";
import dayjs from "dayjs";
import { DateTime } from "luxon";

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

  for (const page of pages) {
    for (const key in page.properties) {
      const prop = page.properties[key];
      if (prop.type === "relation") arr.push(...prop.relation.map(r => r.id));
    }
  }

  return arr;
}


export const removeDuplicates = (arr: string[]): string[] => Array.from(new Set(arr));

export const IconText = ({ icon, text }: { icon: React.JSX.Element; text: string }): React.JSX.Element => (
  <div className="flex flex-row gap-2 items-center">
    {icon}
    {text}
  </div>
);

export function getErrorMessage(error: unknown): string {
  if (!error) return "Unknown error";

  // Erros do Axios ou objetos similares com "response"
  if (typeof error === "object" && error !== null) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const err = error as any;

    if (err.response) {
      if (typeof err.response.data?.message === "string") return err.response.data.message;
      if (typeof err.response.statusText === "string") return err.response.statusText;
    }

    // Caso tenha a propriedade "message" (ex: Error, custom error, etc)
    if ("message" in err && typeof err.message === "string") return err.message;
  }

  // Error padrão do JS
  if (error instanceof Error && typeof error.message === "string") {
    return error.message;
  }

  // Outros tipos (string, number, etc)
  return String(error);
}


export const swrNoRefresh = {
  refreshInterval: 0,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  refreshWhenHidden: false,
};

export const getDbPagesUrl = (databaseId?: string): string | null => {
  if (!databaseId) return null;
  return `/api/page/${databaseId}`;
  // return `/api/get_database_pages?databaseId=${databaseId}`;
};