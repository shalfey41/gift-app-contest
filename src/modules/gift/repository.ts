import prisma from '@/modules/prisma/prisma';
import { PrismaTxn } from '@/modules/types';

export const getGifts = async (prismaTxn?: PrismaTxn) => {
  return (prismaTxn || prisma).gift.findMany();
};

export const incrementAvailableGiftsById = async (ids: string[], prismaTxn?: PrismaTxn) => {
  return (prismaTxn || prisma).gift.updateMany({
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

export const decrementAvailableGiftById = async (giftId: string, prismaTxn?: PrismaTxn) => {
  // The updateMany method prevents race conditions
  // because MongoDB performs the update operation atomically
  return (prismaTxn || prisma).gift.updateMany({
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
