import { NextResponse } from 'next/server';
import { deleteExpiredInvoices } from '@/modules/activeInvoice/service';

export const dynamic = 'force-dynamic';

// Runs cron every day at 10 AM just for the demo purposes (in real life, I would run it every 15 minutes)
export function GET(request: Request) {
  if (request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  deleteExpiredInvoices();

  return NextResponse.json({ ok: true });
}
