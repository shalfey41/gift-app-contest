'use server';

import { Prisma, PrismaClient } from '@prisma/client';
import UserWhereInput = Prisma.UserWhereInput;

const prisma = new PrismaClient();

export const getUserByTelegramId = async (telegramId: number) => {
  return prisma.user.findFirst({
    where: {
      telegramId,
    },
  });
};

export const upsertUserByTelegramId = async (
  telegramId: number,
  { userName, avatarUrl }: { userName: string; avatarUrl: string },
) => {
  const nameLowerCase = userName.toLowerCase();

  return prisma.user.upsert({
    where: {
      telegramId,
    },
    update: {
      name: userName,
      nameLowerCase,
      avatarUrl,
    },
    create: {
      telegramId,
      name: userName,
      nameLowerCase,
      avatarUrl,
    },
  });
};

export const getUsers = async (options?: {
  page?: number;
  limit?: number;
  orderBy?: { createdAt: 'asc' | 'desc' };
  include?: {
    eventsAsBuyer?: boolean;
    eventsAsRemitter?: boolean;
    eventsAsBeneficiary?: boolean;
  };
  where?: UserWhereInput;
}) => {
  const page = options?.page ?? 1;
  const limit = options?.limit ?? 50;
  const orderBy = options?.orderBy;
  const include = options?.include;
  const where = options?.where;

  const take = Math.max(limit, 1);
  const skip = (Math.max(page, 1) - 1) * take;
  const query = {
    skip: skip,
    take: limit,
    where,
    ...(orderBy ? { orderBy } : {}),
  };

  const [list, total] = await Promise.all([
    prisma.user.findMany({
      ...query,
      include: {
        eventsAsBuyer: include?.eventsAsBuyer,
        eventsAsRemitter: include?.eventsAsRemitter,
        eventsAsBeneficiary: include?.eventsAsBeneficiary,
      },
    }),
    prisma.user.count(query),
  ]);
  const totalPages = Math.ceil(total / take);

  return {
    list,
    total,
    totalPages,
  };
};

export const getUserRank = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { giftsReceived: true },
  });

  if (!user) {
    throw new Error('User not found.');
  }

  const userGiftsReceived = user.giftsReceived;

  const higherGiftsCount = await prisma.user.count({
    where: {
      giftsReceived: { gt: userGiftsReceived },
    },
  });

  return higherGiftsCount + 1;
};

export const getLeaderboardUsers = async (userId: string) => {
  // Fetch the top users for the leaderboard
  const leaderboardUsers = await prisma.user.findMany({
    orderBy: { giftsReceived: 'desc' },
    take: 50,
    select: {
      id: true,
      name: true,
      avatarUrl: true,
      giftsReceived: true,
    },
  });

  // Assign places to the leaderboard users
  const leaderboard = leaderboardUsers.map((user, index) => ({
    id: user.id,
    place: index + 1,
    giftsReceived: user.giftsReceived,
    user: {
      id: user.id,
      name: user.name,
      avatarUrl: user.avatarUrl,
    },
  }));

  // Check if the current user is already in the leaderboard
  const userInLeaderboard = leaderboard.find((u) => u.id === userId);

  let currentUserData = null;

  if (!userInLeaderboard) {
    // Compute the user's rank on-demand
    const userRank = await getUserRank(userId);

    // Fetch current user's data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        giftsReceived: true,
      },
    });

    if (user) {
      currentUserData = {
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
  }

  return {
    leaderboard,
    currentUser: currentUserData,
  };
};

export const createUsers = async (
  data: Array<{
    telegramId: number;
    name: string;
    nameLowerCase: string;
    avatarUrl: string;
    giftsReceived: number;
  }>,
) => {
  return prisma.user.createMany({ data });
};
