import useSWR from "swr";
import axios from "axios";
import { DatabaseItem, SWRConfig } from "@/interfaces";
import { swrNoRefresh } from "@/app/services/helpers";
import { SuccessResponse } from "@/app/services/requests";

interface IUseDB {
  data: DatabaseItem[] | undefined;
  error: unknown;
  isValidating: boolean;
  updateData: () => Promise<DatabaseItem[] | undefined>;
}

export function useDatabases(): IUseDB {

  const fetcher = (url: string): Promise<DatabaseItem[]> => axios.get<SuccessResponse<DatabaseItem[]>>(url).then(res => res.data.data || []);

  const options: SWRConfig<DatabaseItem[]> = { ...swrNoRefresh, refreshInterval: 5 * 60 * 1000 };

  const { data, error, isValidating, mutate } = useSWR<DatabaseItem[]>("/api/get_databases", fetcher, options);

  const updateData = (): Promise<DatabaseItem[] | undefined> => mutate(data);

  return { data, error, isValidating, updateData };
}