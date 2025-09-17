import { Page } from '@/notionInterfaces';
import axios from 'axios';

type ExtractedProperties = Record<string, string | number | null>;

export async function getDatabaseItems<T>(url: string): Promise<(T & { id: string })[]> {
  const { data: pages } = await axios.get<Page[]>(url);

  const items = pages.map((page) => {
    const { id, properties } = page;

    const itemProps = Object.keys(properties).reduce<ExtractedProperties>((acc, propKey) => {
      const propValue = properties[propKey];

      let value: string | number | null = null;

      try {
        if (propValue.type === 'title') {
          value = propValue.title[0]?.plain_text ?? null;
        } else if (propValue.type === 'number') {
          value = propValue.number ?? null;
        } else if (propValue.type === 'date') {
          value = propValue.date?.start ?? null;
        } else if (propValue.type === 'relation') {
          value = propValue.relation[0]?.id ?? null;
        } else if (propValue.type === 'rollup') {
          value = propValue.rollup.array?.[0]?.title[0]?.plain_text ?? null;
        }
      } catch (e) {
        throw new Error(e instanceof Error ? e.message : String(e));
      }

      acc[propKey] = value;
      return acc;
    }, {});

    return { id, ...itemProps } as T & { id: string };
  });

  console.log(`pages (url: ${url})`, pages);
  console.log('Items', items);

  return items;
}