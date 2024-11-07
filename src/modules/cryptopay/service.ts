'use server';

import { CryptoCurrencyCode } from 'crypto-bot-api';
import Big from 'big.js';
import { Gift } from '@prisma/client';
import * as repository from '@/modules/cryptopay/repository';
import { decrementGiftAvailableAmount } from '@/modules/gift/service';
import { createActiveInvoice } from '@/modules/activeInvoice/service';

export const createInvoice = async (gift: Gift, userId: string) => {
  const errorResult = {
    giftIsNotAvailable: false,
  };

  try {
    const hasAvailableGift = await decrementGiftAvailableAmount(gift.id);

    if (hasAvailableGift === false) {
      errorResult.giftIsNotAvailable = true;
      return errorResult;
    }

    const invoice = await repository.createInvoice({
      amount: gift.price,
      asset: gift.asset as CryptoCurrencyCode,
      description: `Purchasing a ${gift.name} gift`,
      payload: {
        giftId: gift.id,
        userId,
      },
      isAllowAnonymous: true,
      expiresIn: 60 * 15, // 15 minutes
    });

    await createActiveInvoice({
      invoiceId: invoice.id,
      userId,
      giftId: gift.id,
    });

    return invoice;
  } catch (error) {
    console.error(error);
    return errorResult;
  }
};

export const getPriceInUsd = async (price: number, asset: string) => {
  try {
    const exchangeRate = await repository.getExchangeRate(asset);
    const usdAssetPrice = new Big(exchangeRate);

    return usdAssetPrice.times(price).toFixed(2);
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getInvoiceStatus = async (invoiceId: number) => {
  try {
    return repository.getInvoiceStatus(invoiceId);
  } catch (error) {
    console.error(error);
    return null;
  }
};
