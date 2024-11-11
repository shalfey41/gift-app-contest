'use server';

import CryptoBot, { CryptoCurrencyCode } from 'crypto-bot-api';
import { Gift, PrismaClient } from '@prisma/client';
import { ErrorCode, PrismaTxn } from '@/modules/types';
import { getI18n, getLanguageCookie } from '@/modules/i18n/service';
import { createActiveInvoice } from '@/modules/activeInvoice/repository';
import { decrementAvailableGiftById } from '@/modules/gift/repository';

const token = process.env.CRYPTO_PAY_TOKEN;

if (!token) {
  throw new Error('CRYPTO_PAY_TOKEN environment variable not found.');
}

const prisma = new PrismaClient();
const cryptoBot = new CryptoBot(token);

export const createInvoice = async ({
  amount,
  asset,
  description,
  payload,
  isAllowAnonymous,
  expiresIn,
}: {
  amount: number;
  asset: CryptoCurrencyCode;
  description?: string;
  payload?: Record<string, unknown>;
  isAllowAnonymous?: boolean;
  expiresIn?: number;
}) => {
  return cryptoBot.createInvoice({
    amount,
    asset,
    description,
    payload,
    isAllowAnonymous,
    expiresIn,
  });
};

export const getInvoiceStatus = async (invoiceId: number) => {
  const data = await cryptoBot.getInvoices({ ids: [invoiceId] });

  if (!data.length) {
    return null;
  }

  return data[0]?.status || null;
};

export const getInvoicesById = async (ids: number[]) => {
  return cryptoBot.getInvoices({ ids });
};

export const createInvoiceTransaction = async (gift: Gift, userId: string) => {
  try {
    const [t, lang] = await Promise.all([getI18n(), getLanguageCookie()]);

    return await prisma.$transaction(async (txn: PrismaTxn) => {
      const availableGifts = await decrementAvailableGiftById(gift.id, txn);
      const hasAvailableGifts = availableGifts.count > 0;

      if (!hasAvailableGifts) {
        throw ErrorCode.giftIsSoldOut;
      }

      const invoice = await createInvoice({
        amount: gift.price,
        asset: gift.asset as CryptoCurrencyCode,
        description: t('cryptoPay.invoiceDescription', { gift: gift.name }),
        payload: {
          giftId: gift.id,
          userId,
          lang,
        },
        isAllowAnonymous: true,
        expiresIn: 60 * 15, // 15 minutes
      });

      await createActiveInvoice(
        {
          invoiceId: invoice.id,
          userId,
          giftId: gift.id,
        },
        txn,
      );

      return invoice;
    });
  } catch (error) {
    if (typeof error === 'string' && error in ErrorCode) {
      throw new Error(error);
    }

    console.error(error);
    throw new Error(ErrorCode.unknown);
  }
};
