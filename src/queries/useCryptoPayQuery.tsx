import { useQuery } from '@tanstack/react-query';
import { getPriceInUsd } from '@/modules/cryptopay/service';

export const usePriceInUsdQueryKey = 'getExchangeRate';

export const usePriceInUsdQuery = (price: number, asset: string) => {
  return useQuery({
    queryKey: [usePriceInUsdQueryKey, price, asset],
    queryFn: () => getPriceInUsd(price, asset),
    refetchOnWindowFocus: false,
  });
};
