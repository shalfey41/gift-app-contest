import { Pagination, PrismaTxn } from '@/modules/types';
import { Prisma, User } from '@prisma/client';
import UserWhereInput = Prisma.UserWhereInput;
import UserGetPayload = Prisma.UserGetPayload;
import UserOrderByWithAggregationInput = Prisma.UserOrderByWithAggregationInput;
import UserSelect = Prisma.UserSelect;
import prisma from '@/modules/prisma/prisma';

export const getUserByTelegramId = async (telegramId: number, prismaTxn?: PrismaTxn) => {
  return (prismaTxn || prisma).user.findUnique({
    where: {
      telegramId,
    },
  });
};

export const getUserById = async (userId: string, prismaTxn?: PrismaTxn) => {
  return (prismaTxn || prisma).user.findUnique({
    where: {
      id: userId,
    },
  });
};

export const upsertUserByTelegramId = async (
  telegramId: number,
  { userName, avatarUrl }: { userName: string; avatarUrl: string },
  prismaTxn?: PrismaTxn,
) => {
  const nameLowerCase = userName.toLowerCase();

  return (prismaTxn || prisma).user.upsert({
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

export const getUsers = async (
  options?: {
    page?: number;
    limit?: number;
    orderBy?: UserOrderByWithAggregationInput;
    where?: UserWhereInput;
    select?: UserSelect;
  },
  prismaTxn?: PrismaTxn,
): Promise<Pagination<UserGetPayload<null>>> => {
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
    (prismaTxn || prisma).user.findMany({
      ...query,
      select,
    }),
    (prismaTxn || prisma).user.count(query),
  ]);
  const totalPages = Math.ceil(total / take);

  return {
    list,
    page,
    total,
    totalPages,
  };
};

export const getUserRank = async (user: User, prismaTxn?: PrismaTxn) => {
  const higherRankCount = await (prismaTxn || prisma).user.count({
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

export const incrementReceivedGifts = async (id: string, prismaTxn?: PrismaTxn) => {
  return (prismaTxn || prisma).user.updateMany({
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
