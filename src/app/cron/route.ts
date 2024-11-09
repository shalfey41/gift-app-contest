import { deleteExpiredInvoices } from '@/modules/activeInvoice/service';

export const dynamic = 'force-dynamic';

export function GET() {
  console.log('CRON STARTED');

  deleteExpiredInvoices();

  return new Response('ok');
}
