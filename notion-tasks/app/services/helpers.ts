import { IDatabase, INotionDatabase, INotionPage, IProjectTask, ITasksColumn, TTaskPropValues } from '@/interfaces';

export function plainNotionData(notionDatabases: INotionDatabase[]): IDatabase[] {
  return notionDatabases.map(i => {
    const getPlainText = (prop?: { plain_text?: string }[]): string => prop?.[0]?.plain_text ?? '';

    return {
      id: i.id,
      title: getPlainText(i.title),
      description: getPlainText(i.description),
      created_time: i.created_time,
      last_edited_time: i.last_edited_time,
      properties: Object.values(i.properties),
    };
  });
}

export function getColumnsFromDatabases(databases: IDatabase[] | undefined): ITasksColumn[] {
  if (!databases || !databases.length) return [];

  const seen = new Set<string>();
  const result: ITasksColumn[] = [];

  databases.forEach(db => {
    // @ts-expect-error: Ignore error for 'name'
    db.properties.forEach(({ name, type }) => {
      if (!seen.has(name)) {
        seen.add(name);
        result.push({ name, type });
      }
    });
  });

  return result;
}


export const swrOptions = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  refreshInterval: 0,
};



export function plainNotionPages(notionPages: INotionPage[] | undefined, tasksColumns: ITasksColumn[]): IProjectTask[] {
  if (!notionPages || !notionPages.length) return [];

  return notionPages.map(nPage => {
    const { id, url, created_time, last_edited_time, properties } = nPage;

    // Cria um objeto com as colunas dinâmicas
    const dynamicProps = tasksColumns.reduce((acc, col) => {
      const colProp = properties[col.name];
      if (!colProp) return acc;

      let value: TTaskPropValues = null;
      if (colProp.type === 'title') value = colProp.title[0].plain_text;
      if (colProp.type === 'rich_text') value = colProp.rich_text[0]?.plain_text ?? null;
      if (colProp.type === 'date') value = colProp.date?.start ?? null;
      if (colProp.type === 'status') value = colProp.status?.name ?? null;
      if (colProp.type === 'select') value = colProp.select?.name ?? null;

      acc[col.name] = value; // pega o valor da propriedade
      return acc;
    }, {} as Record<string, TTaskPropValues>);

    return {
      id, created_time, last_edited_time, url,
      ...dynamicProps, // espalha as colunas dinâmicas
    };
  });
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
    return (a || '').localeCompare(b || '');
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


export function onlyUnique<T>(value: T, index: number, self: T[]): boolean {
  return self.indexOf(value) === index;
}