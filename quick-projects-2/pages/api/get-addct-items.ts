/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/get-addct-types
import type { NextApiRequest, NextApiResponse } from 'next';
import { Client } from '@notionhq/client';
import { IAddctItem } from '../AddctApp';

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {

  try {

    const databaseId = process.env.NOTION_ADDCT_ITEMS_DB!;

    const { results: data } = await notion.databases.query({ database_id: databaseId });

    const results: IAddctItem[] = data.map(page => {
      const { id, properties } = page as { id: string, properties: { [key: string]: any } };
      const Title = properties.Title.title[0]?.plain_text;
      const Date = properties.Date.date.start;
      const Quantity = properties.Quantity.number;
      const Type = {
        id: properties.Type?.relation[0]?.id,
        value: properties['Type (Title)'].rollup.array[0]?.title[0].plain_text,
      };

      const isTypeNull = Type.id == null && Type.value == null;

      return { id, Title, Date, Quantity, Type: isTypeNull ? null : Type };
    });

    res.status(200).json(results);

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
