import useSWR from "swr";
import axios from "axios";
import { IUseDatabaseItems } from "@/components/ExpensesRbcData/CloudContent/hooks/useDatabaseItems";

const fetcher = (url: string): unknown => axios.get(url).then(res => res.data.data); // .data.data porque seu sendSuccess aninha o payload

export function useDatabasePages<T>(databaseId = ""): IUseDatabaseItems<T> {

  const url = databaseId ? `/api/db/${databaseId}` : null;

  const { data, error, isLoading, isValidating, mutate } = useSWR(url, fetcher);

  const updateData = (): Promise<unknown> => mutate();

  return {
    items: (data || []) as T[],
    isLoading,
    isValidating,
    isError: !!error,
    error,
    updateData
  };
}