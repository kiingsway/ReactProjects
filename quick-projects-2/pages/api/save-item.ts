// pages/api/save-item.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Client } from '@notionhq/client';
import { IAddctItem } from '../AddctApp';

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_ADDCT_ITEMS_DB!;

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body: IAddctItem = req.body;

    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Title: {
          title: [{ text: { content: body.Title } }],
        },
        Date: { date: { start: body.Date } },
        Quantity: { number: body.Quantity },
        Type: !body.Type ? undefined :
          { relation: [{ id: body.Type.id }], }

      },
    });

    return res.status(200).json({ success: true, pageId: response.id });
  } catch (error: any) {
    console.error('Error saving item:', error);
    return res.status(500).json({ error: 'Failed to save item' });
  }
}
