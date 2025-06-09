import axios from "axios";
import { GraphMessagesResponse } from "@/interfaces";

export async function getMessages(token: string, nextLink?: string): Promise<{ data: GraphMessagesResponse }> {
  const url = nextLink || (
    "https://graph.microsoft.com/v1.0/me/messages" +
    "?$select=id,receivedDateTime,subject,bodyPreview,isRead,webLink,sender,from&$top=5000"
  );

  const options = { headers: { Authorization: `Bearer ${token}` } };

  return axios.get(url, options);
}