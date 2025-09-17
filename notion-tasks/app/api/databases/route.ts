import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';
import { TResponse } from '@/interfaces';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export async function GET(): TResponse {
  try {
    // A Notion não lista "databases por página" diretamente.
    // O truque é usar `search` com o PAGE_ID como parent.
    const response = await notion.search({
      filter: {
        property: 'object',
        value: 'database',
      },
    });

    // opcional: se quiser filtrar databases dentro de uma página específica
    // const databases = response.results;
    const databases = response.results.filter((db: any) => db.parent?.page_id === process.env.VIEPROJECTS_PAGEID);

    return NextResponse.json(databases);
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { error: 'Erro ao buscar bancos de dados' },
      { status: 500 }
    );
  }
}
