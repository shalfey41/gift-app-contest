import prisma from '@/modules/prisma/prisma';

export const createActiveInvoice = async ({
  invoiceId,
  userId,
  giftId,
}: {
  invoiceId: number;
  giftId: string;
  userId: string;
}) => {
  return prisma.activeInvoce.create({
    data: {
      invoiceId,
      userId,
      giftId,
    },
  });
};

export const getActiveInvoices = async (options: { limit?: number; orderBy?: 'asc' | 'desc' }) => {
  return prisma.activeInvoce.findMany({
    ...(options.orderBy ? { orderBy: { createdAt: options.orderBy } } : {}),
    take: options.limit,
  });
};

export const deleteActiveInvoicesByInvoiceId = async (invoiceIds: number[]) => {
  return prisma.activeInvoce.deleteMany({
    where: {
      invoiceId: {
        in: invoiceIds,
      },
    },
  });
};
