import { useQuery } from '@tanstack/react-query';
import WebApp from '@twa-dev/sdk';
import {
  getLeaderboardUsers,
  getUserByTelegramId,
  getUsersWithoutMe,
} from '@/modules/user/service';

export const useCurrentUserQueryKey = 'currentUser';
export const useLeaderboardUsersQueryKey = 'getLeaderboardUsers';
export const useUsersWithoutMeQueryKey = 'getUsersWithoutMe';

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

export const useLeaderboardUsersQuery = (nameQuery?: string) => {
  return useQuery({
    queryKey: [useLeaderboardUsersQueryKey, nameQuery || ''],
    queryFn: async () => getLeaderboardUsers({ nameQuery }),
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
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
