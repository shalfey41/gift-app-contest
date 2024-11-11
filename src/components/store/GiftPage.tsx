import React, { lazy, Suspense, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { BackButton } from '@twa-dev/sdk/react';
import WebApp from '@twa-dev/sdk';
import { useQueryClient } from '@tanstack/react-query';
import { InvoiceStatus } from 'crypto-bot-api';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Gift } from '@prisma/client';
import { useBoughtGiftsByUserIdQueryKey, useRecentGiftEventsQuery } from '@/queries/useEventQuery';
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
import { useGiftsQueryKey } from '@/queries/useGiftQuery';
import { createInvoice, getInvoiceStatus } from '@/app/cryptopay/actions';
import { ErrorCode } from '@/modules/types';

const LazyGiftLottie = lazy(() => import('@/components/ui/LazyGiftLottie'));

type Props = {
  gift: Gift;
  goNext: () => void;
  goBack: () => void;
};

export default function GiftPage({ gift, goNext, goBack }: Props) {
  const { t } = useTranslation();
  const { setBottomBar } = useContext(PageContext);
  const { data: recentEvents, isLoading: isLoadingEvents } = useRecentGiftEventsQuery(gift.id);
  const animation = getGiftAnimationBySymbol(gift.symbol);
  const isSoldOut = gift.availableAmount === 0;
  const queryClient = useQueryClient();
  const isMounted = useRef(false);
  const [isLoading, setLoader] = useState(false);
  const { data: user } = useCurrentUserQuery();

  const checkInvoiceStatus = useCallback(
    async (invoiceId: number) => {
      const status = await getInvoiceStatus(invoiceId);

      if (status === InvoiceStatus.Paid) {
        queryClient.invalidateQueries({ queryKey: [useGiftsQueryKey] });
        queryClient.invalidateQueries({ queryKey: [useBoughtGiftsByUserIdQueryKey] });

        if (isMounted.current) {
          goNext();
        }
      } else {
        setTimeout(() => checkInvoiceStatus(invoiceId), 5000);
      }
    },
    [goNext, queryClient],
  );

  const pay = useCallback(async () => {
    if (!user) {
      return;
    }

    setLoader(true);

    try {
      const invoice = await createInvoice(gift, user.id);

      WebApp.openTelegramLink(`${invoice.miniAppPayUrl}&mode=compact`);
      checkInvoiceStatus(invoice.id);
    } catch (error: any) {
      setLoader(false);

      const message =
        error?.message === ErrorCode.giftIsSoldOut
          ? t('store.gift.error.soldOut')
          : t('store.gift.error.invoice');

      WebApp.showAlert(message);

      if (error === ErrorCode.giftIsSoldOut) {
        goBack();
      }
    }
  }, [t, checkInvoiceStatus, gift, goBack, user]);

  // handle checkInvoiceStatus race condition
  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    setBottomBar(
      <motion.div
        className="px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Button
          className="w-full"
          size="large"
          isLoading={isLoading}
          // disabled={isSoldOut || isLoading}
          onClick={pay}
        >
          {t('store.gift.buy')}
        </Button>
      </motion.div>,
    );
  }, [t, pay, isLoading, goNext, isSoldOut, setBottomBar]);

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
            <Suspense>
              <LazyGiftLottie
                animationData={animation}
                renderer="canvas"
                className="h-[267px] w-[267px]"
              />
            </Suspense>
          </div>

          <div className="mb-2 mt-3 flex items-center gap-3">
            <h2 className="text-lg font-semibold">{gift.name}</h2>
            <p className="rounded-full bg-primary/[0.12] px-2 text-s font-medium text-primary">
              {isSoldOut
                ? t('gift.soldOut')
                : t('gift.available', { amount: gift.availableAmount, total: gift.totalAmount })}
            </p>
          </div>
          <p className="mb-2 text-label-secondary">{t('store.gift.text')}</p>
          <p className="flex items-center gap-2 font-medium">
            <Image width={20} height={20} src={assetIcon[gift.asset]} alt={gift.asset} />
            <span>
              {gift.price} {gift.asset}
            </span>
          </p>
        </div>

        <div className="bg-background pb-4">
          <h2 className="mt-2 p-4 text-xs uppercase text-label-date">{t('store.event.title')}</h2>

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
              <p className="text-s text-label-secondary">{t('store.event.empty')}</p>
            </div>
          )}
        </div>
        <BackButton onClick={() => goBack()} />
      </div>
    </div>
  );
}
