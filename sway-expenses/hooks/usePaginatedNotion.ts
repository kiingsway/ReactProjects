/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { getErrorMessage } from "@/services/helpers";

export function usePaginatedNotion(databaseId: string) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateData = useCallback(async () => {
    if (!databaseId) return;

    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/api/db/${databaseId}`);
      setData(res.data);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [databaseId]);

  useEffect(() => {
    updateData();
  }, [updateData]);

  return { data, isLoading, error, updateData };
}
