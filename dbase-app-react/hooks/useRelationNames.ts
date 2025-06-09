import axios from "axios";
import useSWR from "swr";

interface IUseRelationNames {
  names: string[];
  isLoading: boolean;
  hasError: boolean;
}

const fetcher = (url: string): Promise<any> => axios.get(url).then(res => res.data);

export function useRelationNames(relationIds: string[]): IUseRelationNames {
  // Remove duplicados pra não fazer requests repetidos
  const uniqueIds = Array.from(new Set(relationIds));

  // usa SWR para cada ID, retorna um array de dados ou erro
  const swrResults = uniqueIds.map(id => useSWR(`/api/get_page/${id}`, fetcher)); // React Hook "useSWR" cannot be called inside a callback. React Hooks must be called in a React function component or a custom React Hook function.eslintreact-hooks/rules-of-hooks

  // Extrai nomes e erros
  const names = swrResults.map(({ data }) => data?.properties.Nome.title[0].plain_text ?? null).filter(Boolean) as string[];
  const errors = swrResults.map(({ error }) => error);

  // Se algum erro ocorreu, retorne erro
  const hasError = errors.some(e => e != null);

  // Se ainda algum nome estiver indefinido (loading), considere carregando
  const isLoading = names.some(name => name === null);

  return { names, isLoading, hasError };
}