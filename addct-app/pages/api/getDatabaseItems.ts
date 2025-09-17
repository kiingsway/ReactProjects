// pages/api/getDatabaseItems.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  try {
    const databaseId = process.env.NOTION_ADDCT_DB!;
    const response = await notion.databases.query({ database_id: databaseId });

    const results = response.results.map(page => {
      const properties = page.properties;

      const item: Record<string, any> = {};

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
            item[key] = prop.relation.map(rel => rel.id); // retorna id por enquanto
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
                const page = await notion.pages.retrieve({ page_id: pageId });
                const titleProp = Object.values(page.properties).find(
                  p => p.type === 'title'
                );
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
