import prisma from '@/modules/prisma/prisma';

export const getGifts = async () => {
  return prisma.gift.findMany();
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
