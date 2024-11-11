'use server';

import { isHashValid } from '@/modules/bot/utils';
import * as service from '@/modules/bot/service';

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  throw new Error('TELEGRAM_BOT_TOKEN environment variable not found.');
}

export const validateHash = async (telegramInitData: string): Promise<boolean> => {
  const initData = new URLSearchParams(telegramInitData);

  if (!initData.get('hash')) {
    throw new Error('Missing required field hash');
  }

  return isHashValid(Object.fromEntries(initData), token);
};

export const getBotInfo = async () => {
  return service.getBotInfo();
};
