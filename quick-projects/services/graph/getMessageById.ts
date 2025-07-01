import axios from "axios";
import { IMessage } from "@/interfaces"; // defina esse tipo conforme seus dados

/**
 * Fetch a single email by its ID.
 * @param token Authorization Bearer token
 * @param messageId The ID of the email message
 * @param folderId (optional) The ID of the folder containing the message
 */
export async function getMessageById(token: string, messageId: string, folderId?: string): Promise<{ data: IMessage }> {
  const base = "https://graph.microsoft.com/v1.0";
  const select = "?select=body,ccRecipients,bccRecipients,flag,hasAttachments,importance,toRecipients";
  const url = folderId
    ? `${base}/me/mailFolders/${encodeURIComponent(folderId)}/messages/${encodeURIComponent(messageId)}${select}`
    : `${base}/me/messages/${encodeURIComponent(messageId)}${select}`;

  const options = { headers: { Authorization: `Bearer ${token}` } };

  return axios.get(url, options);
}
