import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getGifts } from '@/app/gift/actions';

export const useGiftsQueryKey = 'getGifts';

export const useGiftsQuery = () => {
  return useQuery({
    queryKey: [useGiftsQueryKey],
    queryFn: () => getGifts(),
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
};
