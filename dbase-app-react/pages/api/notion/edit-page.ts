/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/edit_page.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { Client } from "@notionhq/client";
import { sendError, sendSuccess } from "@/app/services/requests";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== "POST") return sendError(res, "Method not allowed", 405);

  const { page_id, properties, icon, cover } = req.body;

  if (!validateUpdatePayload(req.body)) return sendError(res, "Missing required fields", 400, req.body);

  try {
    const response = await notion.pages.update({
      page_id,
      properties,
      ...(icon && { icon }),
      ...(cover && { cover }),
    });

    return sendSuccess(res, response, "Page updated successfully");
  } catch (error: unknown) {
    const msg = `Error updating page: ${error instanceof Error && error.message ? error.message : "Unknown error"}`;
    return sendError(res, msg, 500, req.body);
  }
}

interface IPayload { page_id: string; properties: Record<string, any>; }

function validateUpdatePayload(payload: any): payload is IPayload {
  const isValidId = typeof payload.page_id === "string" && payload.page_id.trim().length > 0;
  const hasProperties = payload.properties && typeof payload.properties === "object" && Object.keys(payload.properties).length > 0;
  return isValidId && hasProperties;
}