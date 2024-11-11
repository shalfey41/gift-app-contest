import { useQuery } from '@tanstack/react-query';
import WebApp from '@twa-dev/sdk';
import { getBotInfo, validateHash } from '@/app/bot/actions';

export const useValidateInitDataQueryKey = 'validateHash';
export const useBotInfoQueryKey = 'botInfo';

export const useValidateInitDataQuery = () => {
  return useQuery({
    queryKey: [useValidateInitDataQueryKey],
    queryFn: () => validateHash(WebApp.initData),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useBotInfoQuery = () => {
  return useQuery({
    queryKey: [useBotInfoQueryKey],
    queryFn: () => getBotInfo(),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
