import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { BackButton } from '@twa-dev/sdk/react';
import { useLottie } from 'lottie-react';
import WebApp from '@twa-dev/sdk';
import { useQueryClient } from '@tanstack/react-query';
import { InvoiceStatus } from 'crypto-bot-api';
import { Gift } from '@prisma/client';
import { useRecentGiftEventsQuery } from '@/queries/useEventQuery';
import {
  assetIcon,
  getGiftAnimationBySymbol,
  getGiftPatternBackgroundBySymbol,
} from '@/components/utils';
import GiftEventsRow from '@/components/store/GiftEventsRow';
import { PageContext } from '@/components/app/PageContext';
import Button from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';
import { useCurrentUserQuery } from '@/queries/useUserQuery';
import { createInvoice, getInvoiceStatus } from '@/modules/cryptopay/service';
import { useGiftsQueryKey } from '@/queries/useGiftQuery';

type Props = {
  gift: Gift;
  goNext: () => void;
  goBack: () => void;
};

export default function GiftPage({ gift, goNext, goBack }: Props) {
  const { setBottomBar } = useContext(PageContext);
  const { data: recentEvents, isLoading: isLoadingEvents } = useRecentGiftEventsQuery(gift.id);
  const animation = getGiftAnimationBySymbol(gift.symbol);
  const isSoldOut = gift.availableAmount === 0;
  const { View } = useLottie({
    animationData: animation,
    renderer: 'canvas',
    className: 'h-[267px] w-[267px]',
  });
  const queryClient = useQueryClient();
  const invoiceId = useRef<number | null>(null);
  const timeoutId = useRef<number | null>(null);

  const isMounted = useRef(false);
  const [isLoading, setLoader] = useState(false);
  const { data: user } = useCurrentUserQuery();

  const pay = useCallback(async () => {
    if (!user) {
      return;
    }

    setLoader(true);

    const invoice = await createInvoice(gift, user.id);

    if ('giftIsNotAvailable' in invoice) {
      setLoader(false);

      const message = invoice.giftIsNotAvailable
        ? 'Gift is not available'
        : 'Invoice was not created. Try again later.';

      WebApp.showAlert(message);

      if (invoice.giftIsNotAvailable) {
        goBack();
      }

      return;
    }

    WebApp.openTelegramLink(`${invoice.miniAppPayUrl}&mode=compact`);
    invoiceId.current = invoice.id;
  }, [gift, goBack, user]);

  useEffect(() => {
    const checkInvoiceStatus = async () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }

      if (!invoiceId.current) {
        return;
      }

      const status = await getInvoiceStatus(invoiceId.current);

      if (!isMounted.current || !document.hasFocus()) {
        return;
      }

      if (status === InvoiceStatus.Paid) {
        queryClient.invalidateQueries({ queryKey: [useGiftsQueryKey] });
        goNext();
        return;
      }

      timeoutId.current = window.setTimeout(() => checkInvoiceStatus(), 3000);
    };

    window.addEventListener('focus', checkInvoiceStatus, false);

    return () => {
      window.removeEventListener('focus', checkInvoiceStatus);

      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, [goNext, queryClient]);

  // handle checkInvoiceStatus race condition
  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    setBottomBar(
      <div className="px-4">
        <Button className="w-full" size="large" disabled={isSoldOut || isLoading} onClick={pay}>
          Buy a Gift
        </Button>
      </div>,
    );
  }, [pay, isLoading, goNext, isSoldOut, setBottomBar]);

  return (
    <div className="bg-secondary">
      <div className="grid gap-3">
        <div className="bg-background p-4">
          <div
            className="flex aspect-square items-center justify-center rounded-xl"
            style={{
              background: getGiftPatternBackgroundBySymbol(gift.symbol),
            }}
          >
            {View}
          </div>

          <div className="mb-2 mt-3 flex items-center gap-3">
            <h2 className="text-lg font-semibold">{gift.name}</h2>
            <p className="rounded-full bg-primary/[0.12] px-2 text-s font-medium text-primary">
              {isSoldOut ? 'Sold out' : `${gift.availableAmount} of ${gift.totalAmount}`}
            </p>
          </div>
          <p className="mb-2 text-label-secondary">
            Purchase this gift for the opportunity to give it to another user.
          </p>
          <p className="flex items-center gap-2 font-medium">
            <img className="h-5 w-5" src={assetIcon[gift.asset]} alt={gift.asset} />
            <span>
              {gift.price} {gift.asset}
            </span>
          </p>
        </div>

        <div className="bg-background pb-4">
          <h2 className="mt-2 p-4 text-xs uppercase text-label-date">Recent events</h2>

          {isLoadingEvents ? (
            <div className="px-4">
              <Loader />
            </div>
          ) : Array.isArray(recentEvents) && recentEvents.length > 0 ? (
            recentEvents?.map((event, i) => (
              <GiftEventsRow
                event={event}
                key={event.id}
                separator={i !== recentEvents.length - 1}
              />
            ))
          ) : (
            <div className="px-4">
              <p className="text-s text-label-secondary">No events yet</p>
            </div>
          )}
        </div>
        <BackButton onClick={() => goBack()} />
      </div>
    </div>
  );
}
