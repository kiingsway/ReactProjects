import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const payload = req.body;

  // Valida parent.database_id
  if (!payload.parent?.database_id) {
    return res.status(400).json({ error: "Missing required parent.database_id in request body" });
  }

  // Adiciona token e versão da API no header
  try {
    const response = await axios.post("https://api.notion.com/v1/pages", payload, {
      headers: {
        Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
    });

    return res.status(200).json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error creating page in Notion:", error.response?.data || error.message);
      return res.status(500).json({ error: error.response?.data || error.message });
    } else if (error instanceof Error) {
      console.error("Error creating page in Notion:", error.message);
      return res.status(500).json({ error: error.message });
    } else {
      console.error("Error creating page in Notion:", error);
      return res.status(500).json({ error: "An unknown error occurred" });
    }
  }
}
