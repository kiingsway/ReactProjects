// pages/api/addct.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Client } from '@notionhq/client';
import { IAddctItem } from '@/interfaces';

// Inicializa o cliente do Notion
const notion = new Client({ auth: process.env.NOTION_TOKEN });

const DATABASE_ID = process.env.NOTION_ADDCT_DB!;

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    const item: IAddctItem = req.body;

    const response = await notion.pages.create({
      parent: { database_id: DATABASE_ID },
      properties: {
        Title: { title: [{ text: { content: item.Title } }] },
        Date: { date: { start: item.Date } },
        Quantity: { number: item.Quantity },
      },
    });

    return res.status(200).json({ success: true, id: response.id });
  } catch (error) {
    console.error('Erro ao salvar no Notion:', error);
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
}