'use server';

import * as service from '@/modules/cryptopay/service';
import { Gift } from '@prisma/client';

export const createInvoice = async (gift: Gift, userId: string) => {
  return service.createInvoice(gift, userId);
};

export const getInvoiceStatus = async (invoiceId: number) => {
  return service.getInvoiceStatus(invoiceId);
};
