import useSWR from "swr";
import axios from "axios";
import { Page, TitleProperties } from "@/interfaces";
import { getDbPagesUrl, getRelationArrayFromProperties, removeDuplicates } from "@/app/services/helpers";
import { useEffect, useState } from "react";

interface IUseDBPages {
  data: Page[] | undefined;
  error: unknown;
  isValidating: boolean;
  updateData: () => Promise<Page[] | undefined>;
}

export function useDatabasePages(databaseId?: string): IUseDBPages {
  const fetcher = (url: string): Promise<Page[]> => axios.get<Page[]>(url).then(res => res.data);
  const url = getDbPagesUrl(databaseId);

  const { data: dataSWR, error, isValidating, mutate } = useSWR<Page[]>(url, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
  });

  const [data, setData] = useState<Page[] | undefined>();

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      if (dataSWR) setData(await getRelationValues(dataSWR));
    };
    loadData();
  }, [dataSWR]);

  const updateData = (): Promise<Page[] | undefined> => mutate(dataSWR);

  return { data, error, isValidating, updateData };
}


async function getRelationValues(data?: Page[]): Promise<Page[]> {
  if (!data || !data.length) return [];

  // 1. Coletar todos os IDs únicos de relations
  const relationIds = removeDuplicates(getRelationArrayFromProperties(data));

  // 2. Obter os dados das páginas relacionadas
  const relationPages = (await Promise.all(
    relationIds.map(id => axios.get<Page>(`/api/get_page/${id}`)
      .then(res => res.data)
      .catch(() => null) // ou qualquer valor default para erro
    )
  )).filter(Boolean) as Page[];

  // 3. Mapear os IDs para valores (ex: título)
  const relationMap = new Map<string, string>();
  for (const page of relationPages) {
    const titleProp = Object.values(page.properties).find(p => p.type === "title") as TitleProperties | undefined;
    const title = titleProp?.title?.[0]?.plain_text ?? "Sem título";
    relationMap.set(page.id, title);
  }

  // 4. Atualizar os dados com os valores inseridos nos relations
  const enriched = data.map(page => ({
    ...page,
    properties: Object.fromEntries(
      Object.entries(page.properties).map(([key, prop]) => {
        if (prop.type === "relation") {
          return [
            key,
            {
              ...prop,
              relation: prop.relation.map(r => ({
                ...r,
                value: relationMap.get(r.id) || undefined
              }))
            }
          ];
        }
        return [key, prop];
      })
    )
  }));

  return enriched;
}