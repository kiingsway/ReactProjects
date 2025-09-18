import { SWRConfiguration } from 'swr';

export const noRefetcher: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  refreshInterval: 10 * 1000,
  refreshWhenHidden: false,
  refreshWhenOffline: false
};