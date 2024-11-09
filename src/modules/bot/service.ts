'use server';

import { CommandContext, Context, InlineKeyboard } from 'grammy';

import * as repository from '@/modules/bot/repository';
import { getAvatarBackgroundColorByName, handleBotError, isHashValid } from '@/modules/bot/utils';
import { getEventById } from '@/modules/event/service';
import { StartParam } from '@/modules/bot/types';

const botUrl = process.env.TELEGRAM_BOT_URL;
const webAppUrl = process.env.WEB_APP_URL;
const token = process.env.TELEGRAM_BOT_TOKEN;

if (!botUrl) {
  throw new Error('TELEGRAM_BOT_URL environment variable not found.');
}

if (!webAppUrl) {
  throw new Error('WEB_APP_URL environment variable not found.');
}

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

export const getProfilePhoto = async (userId: number, userName: string) => {
  // create hash to make sure the background color is always the same for the same user
  const avatarBackground = getAvatarBackgroundColorByName(userName);
  const defaultAvatarUrl = `https://avatar.iran.liara.run/username?username=${userName}&length=1&size=100&background=${avatarBackground}&color=ffffff`;

  const telegramProfilePhoto = await repository.getFirstUserProfilePhoto(userId);

  return telegramProfilePhoto || defaultAvatarUrl;
};

export const reactToBuyEvent = async (eventId: string) => {
  const event = await getEventById(eventId, { include: { gift: true, buyer: true } });

  if (!event) {
    return;
  }

  try {
    const keyboard = new InlineKeyboard().url(
      'Open Gifts',
      `${botUrl}/app?startapp=${StartParam.openPage}_gifts`,
    );

    await repository.sendMessage(
      Number(event.buyer?.telegramId),
      `✅ You have purchased the gift of *${event.gift.name}*`,
      { keyboard },
    );
  } catch (error: unknown) {
    handleBotError(error);
  }
};

export const reactToSendEvent = async (eventId: string) => {
  const event = await getEventById(eventId, {
    include: { gift: true, remitter: true, beneficiary: true },
  });

  if (!event || !event.beneficiary || !event.remitter || !event.gift) {
    return;
  }

  // do not send message to test users
  if (event.beneficiary.telegramId < 0) {
    return;
  }

  try {
    const keyboard = new InlineKeyboard().url(
      'View Gift',
      `${botUrl}/app?startapp=${StartParam.viewGift}_${event.id}`,
    );

    await repository.sendMessage(
      Number(event.beneficiary.telegramId),
      `⚡️*${event.remitter.name}* has given you the gift of *${event.gift.name}*`,
      { keyboard },
    );
  } catch (error: unknown) {
    handleBotError(error);
  }
};

export const reactToReceiveEvent = async (eventId: string) => {
  const event = await getEventById(eventId, {
    include: { gift: true, remitter: true, beneficiary: true },
  });

  if (!event || !event.beneficiary || !event.remitter || !event.gift) {
    return;
  }

  // do not send message to test users
  if (event.remitter.telegramId < 0) {
    return;
  }

  try {
    const keyboard = new InlineKeyboard().webApp('Open App', webAppUrl);

    await repository.sendMessage(
      Number(event.remitter.telegramId),
      `👌️*${event.beneficiary.name}* received your gift of *${event.gift.name}*`,
      { keyboard },
    );
  } catch (error: unknown) {
    handleBotError(error);
  }
};

export const resetBotWebhook = async () => {
  await repository.deleteWebhook();
  await repository.setWebhook(`${webAppUrl}/bot`);
};

export const getBotInfo = async () => {
  return repository.getInfo();
};

export const sendGreetingsMessage = async (ctx: CommandContext<Context>) => {
  try {
    // todo english russian language
    const keyboard = new InlineKeyboard().url('Open App', `${botUrl}/app`);
    const photoId =
      'AgACAgIAAxkBAAMCZytdwK49uum7MgMdYXEjm6aaQGkAAs_lMRsl3lhJDGBGeBmpyzMBAAMCAAN5AAM2BA';

    await repository.sendPhoto(ctx.chatId, photoId, {
      caption: '🎁 Here you can buy and send gifts to your friends.',
      keyboard,
    });
  } catch (error) {
    handleBotError(error);
  }
};
