import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import {
  createSendEvent,
  getBoughtGiftsByUserId,
  getRecentEventsByGiftId,
} from '@/modules/event/service';

export const useRecentGiftEventsQueryKey = 'getRecentEventsByGiftId';
export const useBoughtGiftsByUserIdQueryKey = 'getBoughtGiftsByUserId';

export const useRecentGiftEventsQuery = (giftId: string) => {
  return useQuery({
    queryKey: [useRecentGiftEventsQueryKey, giftId],
    queryFn: () => getRecentEventsByGiftId(giftId),
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
};

export const useBoughtGiftsByUserIdQuery = (userId?: string) => {
  return useQuery({
    queryKey: [useBoughtGiftsByUserIdQueryKey, userId],
    queryFn: async () => {
      if (!userId) {
        return null;
      }

      return getBoughtGiftsByUserId(userId);
    },
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
};

export const useSendGiftMutation = () => {
  return useMutation({
    mutationFn: async ({
      buyEventId,
      giftId,
      remitterId,
      beneficiaryId,
    }: {
      buyEventId: string;
      giftId: string;
      remitterId: string;
      beneficiaryId: string;
    }) => {
      return createSendEvent({ buyEventId, giftId, remitterId, beneficiaryId });
    },
  });
};
