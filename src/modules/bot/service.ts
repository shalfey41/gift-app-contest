import {
  InlineQueryContext,
  CommandContext,
  Context,
  InlineKeyboard,
  InlineQueryResultBuilder,
} from 'grammy';

import * as repository from '@/modules/bot/repository';
import { getAvatarBackgroundColorByName, handleBotError } from '@/modules/bot/utils';
import { createSendEvent, getBoughtGiftsByUserId, getEventById } from '@/modules/event/service';
import { StartParam } from '@/modules/bot/types';
import { Page } from '@/modules/types';
import { getI18n } from '@/modules/i18n/service';
import { getUserByTelegramId } from '@/modules/user/service';
import ObjectID from 'bson-objectid';
import { giftPreviewPng } from '@/components/utils';
import { InlineQueryResult } from '@grammyjs/types';

const botUrl = process.env.TELEGRAM_BOT_URL;
const webAppUrl = process.env.WEB_APP_URL;
const photoId = process.env.BOT_PHOTO_ID;
const SEND_GIFT_COMMAND = 'sendGift';

if (!photoId) {
  throw new Error('BOT_PHOTO_ID environment variable not found.');
}

if (!botUrl) {
  throw new Error('TELEGRAM_BOT_URL environment variable not found.');
}

if (!webAppUrl) {
  throw new Error('WEB_APP_URL environment variable not found.');
}

export const getProfilePhoto = async (userId: number, userName: string) => {
  // create hash to make sure the background color is always the same for the same user
  const avatarBackground = getAvatarBackgroundColorByName(userName);
  const defaultAvatarUrl = `https://avatar.iran.liara.run/username?username=${userName}&length=1&size=100&background=${avatarBackground}&color=ffffff`;

  const telegramProfilePhoto = await repository.getFirstUserProfilePhoto(userId);

  return telegramProfilePhoto || defaultAvatarUrl;
};

export const reactToBuyEvent = async (eventId: string, lang?: string) => {
  try {
    const event = await getEventById(eventId, { include: { gift: true, buyer: true } });

    if (!event) {
      return;
    }

    const t = await getI18n(lang);
    const keyboard = new InlineKeyboard().url(
      t('bot.openGifts'),
      `${botUrl}/app?startapp=${StartParam.openPage}_${Page.gifts}`,
    );

    await repository.sendMessage(
      Number(event.buyer?.telegramId),
      t('bot.giftBuyNotification', { gift: event.gift.name }),
      { keyboard },
    );
  } catch (error: unknown) {
    handleBotError(error);
  }
};

export const reactToSendEvent = async (eventId: string, lang?: string) => {
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
    const t = await getI18n(lang);
    const keyboard = new InlineKeyboard().url(
      t('bot.viewGift'),
      `${botUrl}/app?startapp=${StartParam.receiveGift}_${event.id}`,
    );

    await repository.sendMessage(
      Number(event.beneficiary.telegramId),
      t('bot.giftSentNotification', { user: event.remitter.name, gift: event.gift.name }),
      { keyboard },
    );
  } catch (error: unknown) {
    handleBotError(error);
  }
};

export const reactToReceiveEvent = async (eventId: string, lang?: string) => {
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
    const t = await getI18n(lang);
    const keyboard = new InlineKeyboard().webApp(t('bot.openApp'), webAppUrl);

    await repository.sendMessage(
      Number(event.remitter.telegramId),
      t('bot.giftReceivedNotification', { user: event.beneficiary.name, gift: event.gift.name }),
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
    const t = await getI18n(ctx.from?.language_code);
    const keyboard = new InlineKeyboard().url(t('bot.openApp'), `${botUrl}/app`);

    await repository.sendPhoto(ctx.chatId, photoId, {
      caption: t('bot.greetings'),
      keyboard,
    });
  } catch (error) {
    handleBotError(error);
  }
};

export const handleInlineQuery = async (ctx: InlineQueryContext<Context>) => {
  try {
    const user = await getUserByTelegramId(ctx.from.id);

    if (!user) {
      await ctx.answerInlineQuery([]);
      return;
    }

    let eventId: string | undefined;

    if (ctx.inlineQuery.query && ObjectID.isValid(ctx.inlineQuery.query)) {
      eventId = ctx.inlineQuery.query;
    }

    let events: Array<{
      id: string;
      eventId: string;
      name: string;
      photoUrl: string;
      boughtAt: string;
    }> = [];

    if (eventId) {
      const oneGiftEvent = await getEventById(eventId, { include: { gift: true } });

      if (oneGiftEvent) {
        events.push({
          id: oneGiftEvent.gift.id,
          eventId: oneGiftEvent.id,
          name: oneGiftEvent.gift.name,
          photoUrl: `${webAppUrl}${giftPreviewPng[oneGiftEvent.gift.symbol]}`,
          boughtAt: oneGiftEvent.createdAt.valueOf().toString(),
        });
      }
    }

    if (!events.length) {
      const boughtGiftsEvents = await getBoughtGiftsByUserId(user.id);

      if (boughtGiftsEvents && boughtGiftsEvents.list) {
        events = boughtGiftsEvents.list
          ?.map((event) => {
            if (!event.gift) {
              return;
            }

            return {
              id: event.gift.id,
              eventId: event.id,
              name: event.gift.name,
              photoUrl: `${webAppUrl}${giftPreviewPng[event.gift.symbol]}`,
              boughtAt: event.boughtAt.valueOf().toString(),
            };
          })
          .filter((gift) => gift !== undefined);
      }
    }

    if (!events.length) {
      await ctx.answerInlineQuery([]);
      return;
    }

    const t = await getI18n(ctx.from.language_code);
    const results = events.map((gift) => {
      const keyboard = new InlineKeyboard().url(
        t('bot.receiveGift'),
        `${botUrl}/app?startapp=${StartParam.receiveGift}_${gift?.eventId}`,
      );

      const articleId = `${SEND_GIFT_COMMAND}_${gift.id}_${gift.eventId}`;
      return InlineQueryResultBuilder.article(articleId, t('bot.sendGiftTitle'), {
        thumbnail_url: gift.photoUrl,
        description: t('bot.sendGiftText', { gift: gift.name }),
        reply_markup: {
          inline_keyboard: keyboard.inline_keyboard,
        },
      }).text(t('bot.receiveGiftMessage'), {
        parse_mode: 'MarkdownV2',
      });
    });

    await ctx.answerInlineQuery(results, {
      is_personal: true,
      cache_time: 30,
    });
  } catch (error) {
    await ctx.answerInlineQuery([]);
    handleBotError(error);
  }
};

export const handleInlineResult = async (
  ctx: Context & { chosenInlineResult: InlineQueryResult },
) => {
  try {
    const result = ctx.chosenInlineResult.result_id.split('_');
    const command = result[0];
    const giftId = result[1];
    const eventId = result[2];

    if (command !== SEND_GIFT_COMMAND || !giftId || !eventId) {
      return;
    }

    const user = await getUserByTelegramId(ctx.chosenInlineResult.from.id);

    if (!user) {
      return;
    }

    const event = await createSendEvent({
      buyEventId: eventId,
      giftId,
      remitterId: user.id,
      lang: ctx.chosenInlineResult.from?.language_code,
    });

    if (event && ctx.chosenInlineResult.inline_message_id) {
      const t = await getI18n(ctx.chosenInlineResult.from?.language_code);
      const keyboard = new InlineKeyboard().url(
        t('bot.receiveGift'),
        `${botUrl}/app?startapp=${StartParam.receiveGift}_${event.id}`,
      );

      repository.editMessageInlineKeyboard(ctx.chosenInlineResult.inline_message_id, keyboard);
    }
  } catch (error) {
    handleBotError(error);
  }
};
