import { handleBotError } from '@/modules/bot/utils';
import ObjectID from 'bson-objectid';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { Bot, InlineKeyboard, InlineQueryResultBuilder, webhookCallback } from 'grammy';
import { createUserIfNotExists, getUserByTelegramId } from '@/modules/user/service';
import { createSendEvent, getBoughtGiftsByUserId, getEventById } from '@/modules/event/service';
import { sendGreetingsMessage } from '@/modules/bot/service';
import { StartParam } from '@/modules/bot/types';
import { giftPreviewPng } from '@/components/utils';
import { getI18n } from '@/modules/i18n/service';

const botUrl = process.env.TELEGRAM_BOT_URL;
const token = process.env.TELEGRAM_BOT_TOKEN;
const webAppUrl = process.env.WEB_APP_URL;

if (!botUrl) {
  throw new Error('TELEGRAM_BOT_URL environment variable not found.');
}

if (!token) {
  throw new Error('TELEGRAM_BOT_TOKEN environment variable not found.');
}

if (!webAppUrl) {
  throw new Error('WEB_APP_URL environment variable not found.');
}

const bot = new Bot(token);
const SEND_GIFT_COMMAND = 'sendGift';

bot.command('start', async (ctx) => {
  if (ctx.from?.id && ctx.from?.first_name) {
    createUserIfNotExists(ctx.from.id, ctx.from.first_name);
  }

  await sendGreetingsMessage(ctx);
});

bot.command('help', async (ctx) => {
  await sendGreetingsMessage(ctx);
});

bot.on('inline_query', async (ctx) => {
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
});

bot.on('chosen_inline_result', async (ctx) => {
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

      bot.api.editMessageReplyMarkupInline(ctx.chosenInlineResult.inline_message_id, {
        reply_markup: {
          inline_keyboard: keyboard.inline_keyboard,
        },
      });
    }
  } catch (error) {
    handleBotError(error);
  }
});

export const POST = webhookCallback(bot, 'std/http');
