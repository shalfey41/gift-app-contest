'use server';

import * as service from '@/modules/cryptopay/service';
import { Gift } from '@prisma/client';
import { AppError, ErrorCode } from '@/modules/types';

export const createInvoice = async (gift: Gift, userId: string) => {
  try {
    return await service.createInvoice(gift, userId);
  } catch (error: any) {
    return { code: error?.message || ErrorCode.unknown } as AppError;
  }
};

export const getInvoiceStatus = async (invoiceId: number) => {
  return service.getInvoiceStatus(invoiceId);
};
