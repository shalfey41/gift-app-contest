import { createHash, createHmac } from 'crypto';
import { CurrencyType, Invoice, InvoiceStatus } from 'crypto-bot-api';

export const checkSignature = async (token: string, signature: string, body: unknown) => {
  try {
    const secret = createHash('sha256').update(token).digest();
    const checkString = JSON.stringify(body);
    const hmac = createHmac('sha256', secret).update(checkString).digest('hex');

    return hmac === signature;
  } catch {
    return false;
  }
};

export const toInvoice = async (input: any): Promise<Invoice> => {
  const invoice: Invoice = {
    id: input.invoice_id || 0,
    status: input.status || InvoiceStatus.Unknown,
    hash: input.hash || '',
    currencyType: input.currency_type || '',
    currency: input.asset || input.fiat || '',
    amount: input.amount || '0',
    isAllowComments: input.allow_comments || false,
    isAllowAnonymous: input.allow_anonymous || false,
    createdAt: new Date(input.created_at),
    botPayUrl: input.bot_invoice_url || '',
    miniAppPayUrl: input.mini_app_invoice_url || '',
    webAppPayUrl: input.web_app_invoice_url || '',
  };
  if (invoice.currencyType === CurrencyType.Crypto) {
    invoice.currency = input.asset || '';
  }
  if (invoice.currencyType === CurrencyType.Fiat) {
    invoice.currency = input.fiat || '';
  }
  if (input.hidden_message !== undefined) invoice.hiddenMessage = input.hidden_message;
  if (input.paid_anonymously !== undefined) invoice.isPaidAnonymously = input.paid_anonymously;
  if (input.expiration_date !== undefined) invoice.expirationDate = new Date(input.expiration_date);
  if (input.paid_at !== undefined) invoice.paidAt = new Date(input.paid_at);
  if (input.description !== undefined) invoice.description = input.description;
  if (input.paid_btn_name !== undefined) invoice.paidBtnName = input.paid_btn_name;
  if (input.paid_btn_url !== undefined) invoice.paidBtnUrl = input.paid_btn_url;
  if (input.comment !== undefined) invoice.comment = input.comment;
  if (input.paid_usd_rate !== undefined) invoice.usdRate = parseFloat(input.paid_usd_rate) || 0;
  if (input.fee_asset !== undefined) invoice.feeAsset = input.fee_asset || '';
  if (input.fee_amount !== undefined) invoice.fee = input.fee_amount || 0;
  if (input.accepted_assets !== undefined) invoice.acceptedAssets = input.accepted_assets;
  if (input.paid_asset !== undefined) invoice.paidAsset = input.paid_asset || '';
  if (input.paid_amount !== undefined) invoice.paidAmount = parseFloat(input.paid_amount) || 0;
  if (input.paid_fiat_rate !== undefined)
    invoice.paidFiatRate = parseFloat(input.paid_fiat_rate) || 0;
  if (input.payload !== undefined) {
    let payload;
    try {
      payload = JSON.parse(input.payload);
    } catch {
      payload = input.payload;
    }
    invoice.payload = payload;
  }
  return invoice;
};
