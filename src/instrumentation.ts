export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const [bot, activeInvoice] = await Promise.all([
      import('@/modules/bot/service'),
      import('@/modules/activeInvoice/service'),
    ]);

    // todo understand what is going on on Vercel
    bot.resetBotWebhook();
    activeInvoice.deleteExpiredInvoices();

    // kind of cron job
    setInterval(
      () => {
        activeInvoice.deleteExpiredInvoices();
      },
      1000 * 60 * 15, // 15 minutes
    );
  }
}
