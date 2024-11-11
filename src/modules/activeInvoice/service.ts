import * as repository from '@/modules/activeInvoice/repository';
import * as cryptoPayRepository from '@/modules/cryptopay/repository';
import * as giftRepository from '@/modules/gift/repository';

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

    if (expiredInvoicesIds.length) {
      repository.deleteActiveInvoicesByInvoiceId(expiredInvoicesIds);
    }

    if (expiredInvoicesGiftIds.length) {
      giftRepository.incrementAvailableGiftsById(expiredInvoicesGiftIds);
    }
  } catch (error) {
    console.error(error);
  }
};

export const createActiveInvoice = async ({
  invoiceId,
  userId,
  giftId,
}: {
  invoiceId: number;
  giftId: string;
  userId: string;
}) => {
  try {
    return repository.createActiveInvoice({ invoiceId, giftId, userId });
  } catch (error) {
    console.error(error);
    return null;
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
