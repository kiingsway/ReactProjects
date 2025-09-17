/* eslint-disable @typescript-eslint/no-explicit-any */
// pages\api\db\[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { Client } from "@notionhq/client";
import { sendError, sendSuccess } from "@/app/services/requests";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { id: databaseId } = req.query;
  if (typeof databaseId !== "string") return sendError(res, "Invalid or missing database ID");

  try {
    if (req.method === "GET") {
      const allPages: any[] = [];
      let cursor: string | undefined = undefined;

      // Paginação: busca todos os itens
      do {
        const response = await notion.databases.query({
          database_id: databaseId,
          page_size: 100,
          start_cursor: cursor,
        });

        allPages.push(...response.results);
        cursor = response.has_more && response.next_cursor ? response.next_cursor : undefined;
      } while (cursor);

      // Expansão de relações
      const expandedPages = await Promise.all(
        allPages.map(async (page) => {
          const expandedProperties: Record<string, any> = {};

          for (const [key, prop] of Object.entries(page.properties)) {
            if (prop.type === "relation") {
              const relatedPages = await Promise.all(
                prop.relation.map(async (rel: any) => {
                  return await notion.pages.retrieve({ page_id: rel.id });
                })
              );
              expandedProperties[key] = relatedPages;
            } else {
              expandedProperties[key] = prop;
            }
          }

          return {
            id: page.id,
            created_time: page.created_time,
            last_edited_time: page.last_edited_time,
            properties: expandedProperties,
          };
        })
      );

      return sendSuccess(res, expandedPages);
    }

    if (req.method === "POST") {
      const properties = req.body;

      if (!properties || typeof properties !== "object") {
        return sendError(res, "Missing or invalid body in POST request", 400);
      }

      const newPage = await notion.pages.create({
        parent: { database_id: databaseId },
        properties,
      });

      return sendSuccess(res, newPage, "Page created successfully");
    }

  } catch (error: any) {
    console.error("Error querying Notion database:", error.message);
    return sendError(res, error.message || "Unknown error");
  }
  // If method is not handled, return 405 Method Not Allowed
  return sendError(res, "Method Not Allowed", 405);
}
