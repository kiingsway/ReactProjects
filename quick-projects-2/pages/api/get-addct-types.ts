/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/get-addct-types
import type { NextApiRequest, NextApiResponse } from 'next';
import { Client } from '@notionhq/client';
import { IAddctType } from '../AddctApp';

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {

  try {

    const databaseId = process.env.NOTION_ADDCT_TYPES_DB!;

    const { results: data } = await notion.databases.query({ database_id: databaseId });

    const results: IAddctType[] = data.map(page => {
      const { id, properties } = page as { id: string, properties: { [key: string]: any } };
      const title = properties.Nome.title[0].plain_text;
      const points = properties.Points.number;
      return { id, title, points };
    }).sort((a, b) => a.title.localeCompare(b.title));

    res.status(200).json(results);

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
