'use server';

import * as repository from '@/modules/user/repository';
import { getProfilePhoto } from '@/modules/bot/service';
import { faker } from '@faker-js/faker';

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

export const getLeaderboardUsers = async ({ nameQuery }: { nameQuery?: string }) => {
  try {
    // return repository.getUsers({
    //   where: {
    //     name: {
    //       startsWith: nameQuery,
    //       mode: 'insensitive',
    //     },
    //   },
    //   include: {
    //     eventsAsBeneficiary: true,
    //   },
    //   limit: 30,
    // });
    return repository.getLeaderboardUsers('123');
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
        name: {
          startsWith: nameQuery,
          mode: 'insensitive',
        },
        id: {
          not: currentUserId,
        },
      },
    });
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
