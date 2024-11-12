import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { PageContext } from '@/components/app/PageContext';
import Loader from '@/components/ui/Loader';
import { useReceivedGiftsByUserIdQuery } from '@/queries/useEventQuery';
import ListEmpty from '@/components/ui/ListEmpty';
import ReceivedGiftCard from '@/components/ui/ReceivedGiftCard';
import usePopup from '@/hooks/usePopup';
import { assetIcon, getGiftAnimationBySymbol } from '@/components/utils';
import { Prisma } from '@prisma/client';
import EventGetPayload = Prisma.EventGetPayload;
import EventInclude = Prisma.EventInclude;
import { Page } from '@/modules/types';
import { useTranslation } from 'react-i18next';
import { getLanguage } from '@/modules/i18n/client';
import { motion } from 'framer-motion';
import WebApp from '@twa-dev/sdk';

type Props = {
  userId: string;
};

export default function UserEvents({ userId }: Props) {
  const { t } = useTranslation();
  const { route, setRoute } = useContext(PageContext);
  const { showPopup, closePopup } = usePopup();
  const { data: events, isPending: isLoadingEvents } = useReceivedGiftsByUserIdQuery(userId);
  const wasGiftOpenedByRoute = useRef(false);
  const timeoutRef = useRef<number | null>(null);

  const selectGift = useCallback(
    (event: EventGetPayload<{ include: EventInclude }>) => {
      WebApp.HapticFeedback.selectionChanged();

      showPopup({
        title: event.gift.name,
        animation: getGiftAnimationBySymbol(event.gift.symbol),
        tableData: [
          {
            key: t('gift.table.from'),
            value: (
              <p className="flex items-center gap-2">
                {event.remitter && (
                  <img
                    className="h-5 w-5 rounded-full"
                    src={event.remitter.avatarUrl}
                    alt={event.remitter.name || t('user.avatar')}
                  />
                )}
                <span>{event.remitter?.name || t('user.anonymous')}</span>
              </p>
            ),
          },
          {
            key: t('gift.table.date'),
            value: new Intl.DateTimeFormat(getLanguage(), {
              dateStyle: 'long',
              timeStyle: 'short',
            }).format(new Date(event.createdAt)),
          },
          {
            key: t('gift.table.price'),
            value: (
              <p className="flex items-center gap-2">
                <img className="h-5 w-5" src={assetIcon[event.gift.asset]} alt={event.gift.asset} />
                <span>
                  {event.gift.price} {event.gift.asset}
                </span>
              </p>
            ),
          },
          {
            key: t('gift.table.availability'),
            value: t('gift.available', {
              amount: event.gift.availableAmount,
              total: event.gift.totalAmount,
            }),
          },
        ],
        buttonText: t('gift.close'),
        onClick: closePopup,
      });
    },
    [t, closePopup, showPopup],
  );

  // for smooth animation
  const [showGifts, toggleShowGifts] = useState(false);
  useEffect(() => {
    timeoutRef.current = window.setTimeout(() => {
      toggleShowGifts(true);
    }, 500);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!events || !events?.total || wasGiftOpenedByRoute.current) {
      return;
    }

    if (!route.params?.eventId) {
      return;
    }

    const event = events.list.find((event) => event.id === route.params?.eventId);

    if (event) {
      selectGift(event);
      wasGiftOpenedByRoute.current = true;
      setRoute({ page: Page.profile });
    }
  }, [events]);

  if (isLoadingEvents) {
    return (
      <div className="mt-5 flex w-full justify-center">
        <Loader />
      </div>
    );
  }

  if (!events || !events?.total) {
    return (
      <ListEmpty
        title={t('user.receivedGiftsEmpty')}
        onClick={() => setRoute({ page: Page.store })}
      />
    );
  }

  if (!showGifts) {
    return (
      <div className="mt-5 flex w-full justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="grid grid-cols-3 gap-2"
    >
      {events.list.map((event) => (
        <ReceivedGiftCard
          key={event.id}
          user={event.remitter}
          gift={event.gift}
          selectGift={() => selectGift(event)}
        />
      ))}
    </motion.div>
  );
}
