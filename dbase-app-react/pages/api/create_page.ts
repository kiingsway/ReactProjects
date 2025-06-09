import type { NextApiRequest, NextApiResponse } from "next";
import { Client } from "@notionhq/client";
import { Page } from "@/interfaces";
import { sendError, sendSuccess } from "@/app/services/requests";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {

  if (req.method !== "POST") return sendError(res, "Method not allowed", 405);

  if (!validateNotionPayload(req.body)) return sendError(res, "Missing parameters", 400, req.body);

  try {
    const response = await notion.pages.create(req.body);

    return sendSuccess(res, response, "Page created successfully");
  } catch (error: unknown) {
    const msg = `Error creating page: ${error instanceof Error && (error as Error).message ? (error as Error).message : "Unknown error"}`;
    return sendError(res, msg, 500, req.body);
  }
}

export function validateNotionPayload(payload: Page): boolean {
  // Verifica se o database_id existe e não está vazio
  const hasValidDatabaseId = !!payload.parent?.database_id?.trim();

  // Verifica se o objeto properties tem ao menos uma chave
  const hasProperties = payload.properties && Object.keys(payload.properties).length > 0;

  return hasValidDatabaseId && hasProperties;
}