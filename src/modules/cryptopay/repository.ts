import CryptoBot, { CryptoCurrencyCode } from 'crypto-bot-api';

const token = process.env.CRYPTO_PAY_TOKEN;

if (!token) {
  throw new Error('CRYPTO_PAY_TOKEN environment variable not found.');
}

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
