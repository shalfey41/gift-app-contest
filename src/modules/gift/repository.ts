'use server';

import { PrismaClient } from '@prisma/client';
import { Asset, GiftSymbol } from '@/modules/gift/types';

const prisma = new PrismaClient();

export const getGifts = async () => {
  return prisma.gift.findMany();
};

export const createGifts = async (
  gifts: Array<{
    symbol: GiftSymbol;
    name: string;
    price: number;
    asset: Asset;
    totalAmount: number;
    availableAmount: number;
  }>,
) => {
  return prisma.gift.createMany({
    data: gifts,
  });
};

export const incrementAvailableGiftsById = async (ids: string[]) => {
  return prisma.gift.updateMany({
    where: {
      id: {
        in: ids,
      },
    },
    data: {
      availableAmount: {
        increment: 1,
      },
    },
  });
};

export const decrementAvailableGiftById = async (giftId: string) => {
  // The updateMany method prevents race conditions
  // because MongoDB performs the update operation atomically
  return prisma.gift.updateMany({
    where: {
      id: giftId,
      availableAmount: {
        gt: 0,
      },
    },
    data: {
      availableAmount: {
        decrement: 1,
      },
    },
  });
};
