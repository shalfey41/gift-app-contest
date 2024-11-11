'use server';

import * as service from '@/modules/user/service';
import { Leaderboard, LeaderboardProfile } from '@/modules/user/types';

export const getUserByTelegramId = async (telegramId: number) => {
  return service.getUserByTelegramId(telegramId);
};

export const getLeaderboardUsersWithMe = async (
  currentUserId: string,
): Promise<Leaderboard | null> => {
  return service.getLeaderboardUsersWithMe(currentUserId);
};

export const searchLeaderboardUsersByName = async (
  nameQuery: string,
): Promise<LeaderboardProfile[] | null> => {
  return service.searchLeaderboardUsersByName(nameQuery);
};

export const getLeaderboardProfileById = async (
  userId: string,
): Promise<LeaderboardProfile | null> => {
  return service.getLeaderboardProfileById(userId);
};

export const getUsersWithoutMe = async (
  currentUserId: string,
  { nameQuery }: { nameQuery?: string },
) => {
  return service.getUsersWithoutMe(currentUserId, { nameQuery });
};
