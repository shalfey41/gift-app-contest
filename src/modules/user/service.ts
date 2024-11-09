'use server';

import * as repository from '@/modules/user/repository';
import { getProfilePhoto } from '@/modules/bot/service';
import { faker } from '@faker-js/faker';
import { Leaderboard, LeaderboardProfile } from '@/modules/user/types';

export const createUserIfNotExists = async (telegramId: number, userName: string) => {
  try {
    const avatarUrl = await getProfilePhoto(telegramId, userName);

    return repository.upsertUserByTelegramId(telegramId, { userName, avatarUrl });
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getUserByTelegramId = async (telegramId: number) => {
  try {
    return repository.getUserByTelegramId(telegramId);
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getLeaderboardUsersWithMe = async (
  currentUserId: string,
): Promise<Leaderboard | null> => {
  try {
    const leaderboardUsers = await repository.getUsers({
      orderBy: { giftsReceived: 'desc' },
      limit: 50,
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        giftsReceived: true,
      },
    });

    const leaderboard = leaderboardUsers.list.map((user, index) => ({
      id: user.id,
      place: index + 1,
      giftsReceived: user.giftsReceived,
      user: {
        id: user.id,
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
    }));

    let meInLeaderboard = leaderboard.find((user) => user.id === currentUserId);

    if (!meInLeaderboard) {
      const user = await repository.getUserById(currentUserId);

      if (!user) {
        throw new Error('User not found');
      }

      const userRank = await repository.getUserRank(user);

      meInLeaderboard = {
        id: user.id,
        place: userRank,
        giftsReceived: user.giftsReceived,
        user: {
          id: user.id,
          name: user.name,
          avatarUrl: user.avatarUrl,
        },
      };
    }

    return {
      list: leaderboard,
      me: meInLeaderboard,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const searchLeaderboardUsersByName = async (
  nameQuery: string,
): Promise<LeaderboardProfile[] | null> => {
  try {
    const users = await repository.getUsers({
      where: {
        nameLowerCase: {
          startsWith: nameQuery ? nameQuery.trim().toLowerCase() : '',
        },
      },
      limit: 5,
    });

    const userRanks = await Promise.all(users.list.map((user) => repository.getUserRank(user)));

    return users.list
      .map((user, index) => ({
        id: user.id,
        place: userRanks[index],
        giftsReceived: user.giftsReceived,
        user: {
          id: user.id,
          name: user.name,
          avatarUrl: user.avatarUrl,
        },
      }))
      .sort((a, b) => a.place - b.place);
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getLeaderboardProfileById = async (
  userId: string,
): Promise<LeaderboardProfile | null> => {
  try {
    const user = await repository.getUserById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    const userRank = await repository.getUserRank(user);

    return {
      id: user.id,
      place: userRank,
      giftsReceived: user.giftsReceived,
      user: {
        id: user.id,
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getUsersWithoutMe = async (
  currentUserId: string,
  { nameQuery }: { nameQuery?: string },
) => {
  try {
    return repository.getUsers({
      where: {
        nameLowerCase: {
          startsWith: nameQuery ? nameQuery.trim().toLowerCase() : '',
        },
        id: {
          not: currentUserId,
        },
      },
      limit: 50,
    });
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const incrementReceivedGifts = async (userId: string) => {
  try {
    return repository.incrementReceivedGifts(userId);
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const createSampleUsers = async () => {
  try {
    const users = [];

    for (let i = 0; i < 30; i++) {
      const name = faker.person.firstName();
      users.push({
        telegramId: faker.number.int({ min: -1000000, max: -1 }),
        name: name,
        nameLowerCase: name.toLowerCase(),
        avatarUrl: faker.image.avatar(),
        giftsReceived: faker.number.int({ min: 0, max: 100 }),
      });
    }

    return repository.createUsers(users);
  } catch (error) {
    console.error(error);
    return null;
  }
};
