import * as repository from '@/modules/gift/repository';

export const getGifts = async () => {
  try {
    return repository.getGifts();
  } catch (error) {
    console.error(error);
    return null;
  }
};
