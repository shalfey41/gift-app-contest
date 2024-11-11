'use server';

import * as service from '@/modules/gift/service';

export const getGifts = async () => {
  return service.getGifts();
};
