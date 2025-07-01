import type { NextApiRequest, NextApiResponse } from "next";
import { Client } from "@notionhq/client";
import { sendError, sendSuccess } from "@/app/services/requests";
import { getErrorMessage } from "@/app/services/helpers";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { id: database_id } = req.query;

  if (typeof database_id !== "string") return sendError(res, "Invalid or missing database ID", 400);

  if (req.method !== "GET") return sendError(res, "Method not allowed", 405);

  try {
    const database = await notion.databases.retrieve({ database_id });
    return sendSuccess(res, database);
  } catch (e: unknown) {
    const message = getErrorMessage(e);
    console.error("Error retrieving database:", message);
    return sendError(res, message, 500, { database_id });
  }
}