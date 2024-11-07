'use server';

import { Bot, InlineKeyboard } from 'grammy';

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  throw new Error('TELEGRAM_BOT_TOKEN environment variable not found.');
}

const bot = new Bot(token);

export const getInfo = async () => {
  await bot.init();

  return bot.botInfo;
};

export const deleteWebhook = async () => bot.api.deleteWebhook();

export const setWebhook = async (url: string) => bot.api.setWebhook(url);

export const getFirstUserProfilePhoto = async (userId: number) => {
  try {
    const userProfilePhotos = await bot.api.getUserProfilePhotos(userId, { limit: 1 });
    const fileId = userProfilePhotos.photos?.[0]?.[0]?.file_id;

    if (!fileId) {
      return null;
    }

    const photoUrl = await bot.api.getFile(fileId);

    return `https://api.telegram.org/file/bot${token}/${photoUrl.file_path}`;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const sendPhoto = async (
  chatId: number,
  photoId: string,
  { caption, keyboard }: { caption?: string; keyboard?: InlineKeyboard },
) => {
  await bot.api.sendPhoto(chatId, photoId, {
    caption,
    ...(keyboard
      ? {
          reply_markup: {
            inline_keyboard: keyboard.inline_keyboard,
          },
        }
      : {}),
  });
};

export const sendMessage = async (
  chatId: number,
  message: string,
  { keyboard }: { keyboard?: InlineKeyboard },
) => {
  await bot.api.sendMessage(chatId, message, {
    parse_mode: 'MarkdownV2',
    ...(keyboard
      ? {
          reply_markup: {
            inline_keyboard: keyboard.inline_keyboard,
          },
        }
      : {}),
  });
};
