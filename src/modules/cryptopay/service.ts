'use server';

import { CryptoCurrencyCode } from 'crypto-bot-api';
import { Gift } from '@prisma/client';
import * as repository from '@/modules/cryptopay/repository';
import { decrementGiftAvailableAmount } from '@/modules/gift/service';
import { createActiveInvoice } from '@/modules/activeInvoice/service';
import { getI18n, getLanguageCookie } from '@/modules/i18n/service';

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

    const [t, lang] = await Promise.all([getI18n(), getLanguageCookie()]);
    const invoice = await repository.createInvoice({
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

export const getInvoiceStatus = async (invoiceId: number) => {
  try {
    return repository.getInvoiceStatus(invoiceId);
  } catch (error) {
    console.error(error);
    return null;
  }
};
