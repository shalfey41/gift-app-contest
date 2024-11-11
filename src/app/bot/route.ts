import { InlineQueryResult } from '@grammyjs/types';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { Bot, Context, InlineQueryContext, webhookCallback } from 'grammy';
import { createUserIfNotExists } from '@/modules/user/service';
import { handleInlineQuery, handleInlineResult, sendGreetingsMessage } from '@/modules/bot/service';

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
  await handleInlineQuery(ctx as InlineQueryContext<Context>);
});

bot.on('chosen_inline_result', async (ctx) => {
  await handleInlineResult(ctx as Context & { chosenInlineResult: InlineQueryResult });
});

export const POST = webhookCallback(bot, 'std/http');
