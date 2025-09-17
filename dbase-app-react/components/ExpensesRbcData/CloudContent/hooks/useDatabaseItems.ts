import useSWR from "swr";
import axios from "axios";

const fetcher = (url: string): unknown => axios.get(url).then(res => res.data.data); // .data.data porque seu sendSuccess aninha o payload

export function useDatabaseItems<T>(databaseId = ""): IUseDatabaseItems<T> {

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

export interface IUseDatabaseItems<T> {
  items: T[];
  isLoading: boolean;
  isValidating: boolean;
  isError: boolean;
  error: unknown;
  updateData: () => Promise<unknown>
}