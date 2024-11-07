import { createBuyEvent } from '@/modules/event/service';
import { deleteActiveInvoicesByInvoiceId } from '@/modules/activeInvoice/service';
import { checkSignature, toInvoice } from '@/modules/cryptopay/utils';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const token = process.env.CRYPTO_PAY_TOKEN;

if (!token) {
  throw new Error('CRYPTO_PAY_TOKEN environment variable not found.');
}

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const isValidSignature = await checkSignature(
      token,
      request.headers.get('crypto-pay-api-signature') || '',
      body,
    );

    if (!isValidSignature) {
      throw new Error('Invalid signature');
    }

    const invoice = await toInvoice(body.payload);
    const event = await createBuyEvent(invoice);

    if (!event) {
      throw new Error('Error creating event');
    }

    deleteActiveInvoicesByInvoiceId([invoice.id]);

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.error();
  }
};
