'use server';

import { Gift } from '@prisma/client';
import * as repository from '@/modules/cryptopay/repository';
import { createInvoiceTransaction } from '@/modules/cryptopay/repository';

export const createInvoice = async (gift: Gift, userId: string) => {
  return createInvoiceTransaction(gift, userId);
};

export const getInvoiceStatus = async (invoiceId: number) => {
  try {
    return repository.getInvoiceStatus(invoiceId);
  } catch (error) {
    console.error(error);
    return null;
  }
};
