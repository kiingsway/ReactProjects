/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/getDatabaseItems.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  try {

    const databaseId = process.env.NOTION_ADDCT_TYPES_DB!;
    const { results: data } = await notion.databases.query({ database_id: databaseId });
    res.status(200).json(data);
    return;

    const results = response.results.map(page => {

      const { id, properties } = page as { id: string, properties: { [key: string]: any } };

      const item: Record<string, any> = { id };

      for (const key in properties) {
        const prop = properties[key];

        switch (prop.type) {
          case 'title':
            item[key] = prop.title.map(t => t.text?.content).join('');
            break;

          case 'rich_text':
            item[key] = prop.rich_text.map(t => t.text?.content).join('');
            break;

          case 'number':
            item[key] = prop.number;
            break;

          case 'relation':
            // pega o título da relação, se houver
            item[key] = prop.relation.map((rel: any) => rel.id); // retorna id por enquanto
            break;

          default:
            item[key] = null;
        }
      }

      return item;
    });

    // Para relações: podemos buscar os títulos correspondentes
    const withRelations = await Promise.all(
      results.map(async item => {
        const newItem = { ...item };

        for (const key in item) {
          if (Array.isArray(item[key]) && item[key].length > 0) {
            // supomos que seja relation
            const titles = await Promise.all(
              item[key].map(async pageId => {
                const { properties } = await notion.pages.retrieve({ page_id: pageId }) as any;
                const titleProp = Object.values(properties).find(p => p.type === 'title');
                if (titleProp && titleProp.type === 'title') {
                  return titleProp.title.map(t => t.text?.content).join('');
                }
                return null;
              })
            );
            newItem[key] = titles.filter(Boolean);
          }
        }

        return newItem;
      })
    );

    res.status(200).json(withRelations);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
