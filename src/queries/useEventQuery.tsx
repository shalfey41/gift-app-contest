import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import {
  createSendEvent,
  getAllEventsByUserId,
  getBoughtGiftsByUserId,
  getEventById,
  getReceivedGiftsByUserId,
  getRecentEventsByGiftId,
  receiveGiftByEventId,
} from '@/modules/event/service';
import { Prisma } from '@prisma/client';
import EventInclude = Prisma.EventInclude;

export const useRecentGiftEventsQueryKey = 'getRecentEventsByGiftId';
export const useBoughtGiftsByUserIdQueryKey = 'getBoughtGiftsByUserId';
export const useEventByIdQueryKey = 'getEventById';
export const useReceivedGiftsByUserIdQueryKey = 'getReceivedGiftsByUserId';
export const useAllEventsByUserIdQueryKey = 'getAllEventsByUserId';
export const useReceiveGiftByEventIdQueryKey = 'receiveGiftByEventId';

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
    enabled: !!userId,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
};

export const useEventByIdQuery = (eventId?: string, include?: EventInclude) => {
  return useQuery({
    queryKey: [useEventByIdQueryKey, eventId],
    queryFn: async () => {
      if (!eventId) {
        return null;
      }

      return getEventById(eventId, { include });
    },
    enabled: !!eventId,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
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

export const useReceivedGiftsByUserIdQuery = (userId?: string) => {
  return useQuery({
    queryKey: [useReceivedGiftsByUserIdQueryKey, userId],
    queryFn: async () => {
      if (!userId) {
        return null;
      }

      return getReceivedGiftsByUserId(userId);
    },
    enabled: !!userId,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    placeholderData: keepPreviousData,
  });
};

export const useAllEventsByUserIdQuery = (userId?: string) => {
  return useQuery({
    queryKey: [useAllEventsByUserIdQueryKey, userId],
    queryFn: async () => {
      if (!userId) {
        return null;
      }

      return getAllEventsByUserId(userId);
    },
    enabled: !!userId,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    placeholderData: keepPreviousData,
  });
};

export const useReceiveGiftByEventIdQuery = (eventId?: string, userId?: string) => {
  return useQuery({
    queryKey: [useReceiveGiftByEventIdQueryKey, eventId, userId],
    queryFn: async () => {
      if (!eventId || !userId) {
        return null;
      }

      return receiveGiftByEventId(eventId, userId);
    },
    enabled: Boolean(eventId && userId),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
  });
};
