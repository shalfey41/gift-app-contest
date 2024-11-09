import { keepPreviousData, useQuery } from '@tanstack/react-query';
import WebApp from '@twa-dev/sdk';
import {
  getLeaderboardUsersWithMe,
  searchLeaderboardUsersByName,
  getUserByTelegramId,
  getUsersWithoutMe,
  getLeaderboardProfileById,
} from '@/modules/user/service';

export const useCurrentUserQueryKey = 'currentUser';
export const useLeaderboardUsersQueryKey = 'getLeaderboardUsersWithMe';
export const useSearchLeaderboardUsersQueryKey = 'searchLeaderboardUsersByName';
export const useUsersWithoutMeQueryKey = 'getUsersWithoutMe';
export const useLeaderboardProfileQueryKey = 'getLeaderboardProfileById';

export const useCurrentUserQuery = () => {
  return useQuery({
    queryKey: [useCurrentUserQueryKey],
    queryFn: async () => {
      const telegramUserId = WebApp.initDataUnsafe.user?.id;

      if (!telegramUserId) {
        return;
      }

      return getUserByTelegramId(telegramUserId);
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export const useUsersWithoutMeQuery = (currentUserId?: string, nameQuery?: string) => {
  return useQuery({
    queryKey: [useUsersWithoutMeQueryKey, currentUserId || '', nameQuery || ''],
    queryFn: async () => {
      if (!currentUserId) {
        return;
      }

      return getUsersWithoutMe(currentUserId, { nameQuery });
    },
    enabled: !!currentUserId,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
};

export const useLeaderboardUsersQuery = (currentUserId?: string) => {
  return useQuery({
    queryKey: [useLeaderboardUsersQueryKey, currentUserId || ''],
    queryFn: async () => {
      if (!currentUserId) {
        return;
      }

      return getLeaderboardUsersWithMe(currentUserId);
    },
    enabled: !!currentUserId,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
};

export const useSearchLeaderboardUsersQuery = (nameQuery?: string) => {
  return useQuery({
    queryKey: [useSearchLeaderboardUsersQueryKey, nameQuery || ''],
    queryFn: async () => {
      if (!nameQuery) {
        return;
      }

      return searchLeaderboardUsersByName(nameQuery);
    },
    enabled: !!nameQuery,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
};

export const useLeaderboardProfileQuery = (userId?: string) => {
  return useQuery({
    queryKey: [useLeaderboardProfileQueryKey, userId || ''],
    queryFn: async () => {
      if (!userId) {
        return;
      }

      return getLeaderboardProfileById(userId);
    },
    enabled: !!userId,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
};
