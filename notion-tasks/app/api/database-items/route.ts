import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';
import { TResponse } from '@/interfaces';

const notion = new Client({
  auth: process.env.NOTION_TOKEN, // token do .env
});

export async function GET(req: Request): TResponse {
  const { searchParams } = new URL(req.url);
  const dbIdsParam = searchParams.get('dbIds'); // ex: 'id1,id2,id3'

  if (!dbIdsParam) {
    return NextResponse.json({ error: 'Missing dbIds' }, { status: 400 });
  }

  const dbIds = dbIdsParam.split(',');

  const results: any[] = [];

  for (const database_id of dbIds) {
    const response = await notion.databases.query({ database_id });
    results.push(...response.results);
  }

  return NextResponse.json(results);
}