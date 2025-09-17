/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

async function expandRelations(page: any) {
  const props = page.properties;
  const expanded: any = {};

  for (const [key, prop] of Object.entries(props)) {
    if (prop.type === "relation") {
      expanded[key] = await Promise.all(
        prop.relation.map(async ({ id }: { id: string }) => {
          const p = await notion.pages.retrieve({ page_id: id });
          const titleProp = Object.values(p.properties).find(
            (p: any) => p.type === "title"
          );
          const name = Array.isArray(titleProp?.title)
            ? titleProp.title[0]?.plain_text
            : null;
          return { id, name };
        })
      );
    } else {
      expanded[key] = prop;
    }
  }

  return {
    id: page.id,
    created_time: page.created_time,
    last_edited_time: page.last_edited_time,
    properties: expanded,
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id: database_id } = req.query;

  if (!database_id || typeof database_id !== "string") {
    return res.status(400).json({ error: "Invalid database ID" });
  }

  // === GET ===
  if (req.method === "GET") {
    try {
      let hasMore = true;
      let startCursor: string | undefined = undefined;
      const allResults: any[] = [];

      while (hasMore) {
        const response = await notion.databases.query({
          database_id,
          page_size: 100,
          start_cursor: startCursor,
        });

        allResults.push(...response.results);
        hasMore = response.has_more;
        startCursor = response.next_cursor || undefined;
      }

      const data = await Promise.all(allResults.map(expandRelations));
      return res.status(200).json(data);
    } catch (error: any) {
      console.error("Erro ao buscar páginas:", error);
      return res.status(500).json({ error: error.message || "Erro interno" });
    }
  }

  // === POST ===
  if (req.method === "POST") {
    try {
      const payload = req.body;

      if (!payload.properties) {
        return res.status(400).json({ error: "Missing properties in body" });
      }

      const page = await notion.pages.create({
        parent: { database_id },
        properties: payload.properties,
        ...(payload.icon && { icon: payload.icon }),
        ...(payload.cover && { cover: payload.cover }),
        ...(payload.children && { children: payload.children }),
      });

      return res.status(201).json(page);
    } catch (error: any) {
      console.error("Erro ao criar página:", error);
      return res.status(500).json({ error: error.message || "Erro interno" });
    }
  }

  // Método não suportado
  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
