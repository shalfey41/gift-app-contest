import prisma from '@/modules/prisma/prisma';
import { PrismaTxn } from '@/modules/types';

export const createActiveInvoice = async (
  {
    invoiceId,
    userId,
    giftId,
  }: {
    invoiceId: number;
    giftId: string;
    userId: string;
  },
  prismaTxn?: PrismaTxn,
) => {
  return (prismaTxn || prisma).activeInvoce.create({
    data: {
      invoiceId,
      userId,
      giftId,
    },
  });
};

export const getActiveInvoices = async (
  options: { limit?: number; orderBy?: 'asc' | 'desc' },
  prismaTxn?: PrismaTxn,
) => {
  return (prismaTxn || prisma).activeInvoce.findMany({
    ...(options.orderBy ? { orderBy: { createdAt: options.orderBy } } : {}),
    take: options.limit,
  });
};

export const deleteActiveInvoicesByInvoiceId = async (
  invoiceIds: number[],
  prismaTxn?: PrismaTxn,
) => {
  return (prismaTxn || prisma).activeInvoce.deleteMany({
    where: {
      invoiceId: {
        in: invoiceIds,
      },
    },
  });
};
