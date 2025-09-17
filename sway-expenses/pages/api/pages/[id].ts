// pages/api/pages/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== "string") return res.status(400).json({ error: "Invalid or missing page ID" });

  try {
    switch (req.method) {
      case "POST": {
        if (!req.body || typeof req.body !== "object") return res.status(400).json({ error: "Missing body for update" });

        const response = await notion.pages.update({ page_id: id, properties: req.body.properties });

        return res.status(200).json(response);
      }

      case "DELETE": {
        // Notion doesn't support hard delete for pages via API, only archiving
        await notion.pages.update({ page_id: id, archived: true });

        return res.status(200).json({ success: true, message: "Page archived" });
      }

      default:
        res.setHeader("Allow", ["PATCH", "DELETE"]);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    const message = typeof error === "object" && error !== null && "message" in error ? error.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
}