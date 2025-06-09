import { IMe } from "@/interfaces";
import axios from "axios";

export async function getMe(token: string): Promise<{ data: IMe }> {

  const url = "https://graph.microsoft.com/v1.0/me";
  const options = { headers: { Authorization: `Bearer ${token}` } };

  return axios.get(url, options);
}