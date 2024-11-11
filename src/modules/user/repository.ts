'use server';

import { Pagination } from '@/modules/types';
import { Prisma, PrismaClient, User } from '@prisma/client';
import UserWhereInput = Prisma.UserWhereInput;
import UserGetPayload = Prisma.UserGetPayload;
import UserOrderByWithAggregationInput = Prisma.UserOrderByWithAggregationInput;
import UserSelect = Prisma.UserSelect;

const prisma = new PrismaClient();

export const getUserByTelegramId = async (telegramId: number) => {
  return prisma.user.findUnique({
    where: {
      telegramId,
    },
  });
};

export const getUserById = async (userId: string) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
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
  orderBy?: UserOrderByWithAggregationInput;
  where?: UserWhereInput;
  select?: UserSelect;
}): Promise<Pagination<UserGetPayload<null>>> => {
  const page = options?.page ?? 1;
  const limit = options?.limit ?? 50;
  const orderBy = options?.orderBy;
  const where = options?.where;
  const select = options?.select;

  const take = Math.max(limit, 1);
  const skip = (Math.max(page, 1) - 1) * take;
  const query = {
    skip: skip,
    take: limit,
    where,
    orderBy,
  };

  const [list, total] = await Promise.all([
    prisma.user.findMany({
      ...query,
      select,
    }),
    prisma.user.count(query),
  ]);
  const totalPages = Math.ceil(total / take);

  return {
    list,
    page,
    total,
    totalPages,
  };
};

export const getUserRank = async (user: User) => {
  const higherRankCount = await prisma.user.count({
    where: {
      OR: [
        { giftsReceived: { gt: user.giftsReceived } },
        {
          giftsReceived: user.giftsReceived,
          createdAt: { lt: user.createdAt },
        },
      ],
    },
  });

  return higherRankCount + 1;
};

export const incrementReceivedGifts = async (id: string) => {
  return prisma.user.updateMany({
    where: {
      id,
    },
    data: {
      giftsReceived: {
        increment: 1,
      },
    },
  });
};
