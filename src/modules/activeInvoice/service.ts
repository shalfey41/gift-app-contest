import * as repository from '@/modules/activeInvoice/repository';
import * as cryptoPayRepository from '@/modules/cryptopay/repository';
import * as giftRepository from '@/modules/gift/repository';
import prisma from '@/modules/prisma/prisma';
import { PrismaTxn } from '@/modules/types';

export const deleteExpiredInvoices = async () => {
  try {
    const activeInvoices = await repository.getActiveInvoices({
      limit: 100,
      orderBy: 'asc',
    });
    const invoiceIds = activeInvoices.map((invoice) => Number(invoice.invoiceId));

    if (!invoiceIds.length) {
      return;
    }

    const cryptoPayInvoices = await cryptoPayRepository.getInvoicesById(invoiceIds);
    const expiredInvoices = cryptoPayInvoices.filter((invoice) => invoice.status === 'expired');
    const expiredInvoicesIds = expiredInvoices.map((invoice) => invoice.id);
    const expiredInvoicesGiftIds = expiredInvoices
      .map((invoice) => invoice.payload?.giftId)
      .filter(Boolean);

    return await prisma.$transaction(async (txn: PrismaTxn) => {
      const transactions = [];

      if (expiredInvoicesIds.length) {
        transactions.push(repository.deleteActiveInvoicesByInvoiceId(expiredInvoicesIds, txn));
      }

      if (expiredInvoicesGiftIds.length) {
        transactions.push(giftRepository.incrementAvailableGiftsById(expiredInvoicesGiftIds, txn));
      }

      return await Promise.all(transactions);
    });
  } catch (error) {
    console.error(error);
  }
};

export const deleteActiveInvoicesByInvoiceId = async (invoiceIds: number[]) => {
  try {
    return repository.deleteActiveInvoicesByInvoiceId(invoiceIds);
  } catch (error) {
    console.error(error);
    return null;
  }
};
