'use server';

import * as repository from '@/modules/gift/repository';

export const getGifts = async () => {
  try {
    return repository.getGifts();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const decrementGiftAvailableAmount = async (giftId: string) => {
  try {
    const result = await repository.decrementAvailableGiftById(giftId);

    return result.count > 0;
  } catch (error) {
    console.error(error);
    return null;
  }
};
