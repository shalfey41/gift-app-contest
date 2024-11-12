'use client';

import React, { useCallback, useState } from 'react';
import { useBoughtGiftsByUserIdQuery, useEventByIdQuery } from '@/queries/useEventQuery';
import { useCurrentUserQuery } from '@/queries/useUserQuery';
import { UserGift } from '@/modules/event/types';
import GiftsListPage from '@/components/gifts/GiftsListPage';
import ContactsListPage from '@/components/gifts/ContactsListPage';
import SendStatusPage from '@/components/gifts/SendStatusPage';
import { assetIcon, getGiftAnimationBySymbol, pageAnimation } from '@/components/utils';
import usePopup from '@/hooks/usePopup';
import { useTranslation } from 'react-i18next';
import { getLanguage } from '@/modules/i18n/client';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import WebApp from '@twa-dev/sdk';

enum Page {
  giftsList,
  contactsList,
  sendStatus,
}

export default function MainPage() {
  const { t } = useTranslation();
  const [eventId, setEventId] = useState<string | null>(null);
  const { showPopup } = usePopup();
  const { data: user } = useCurrentUserQuery();
  const { data: userGifts, isPending: isLoadingGifts } = useBoughtGiftsByUserIdQuery(
    user?.id || '',
  );
  const { data: event, isPending: isLoadingEvent } = useEventByIdQuery(eventId || '', {
    beneficiary: true,
    remitter: true,
    gift: true,
  });
  const [page, setPage] = useState(Page.giftsList);
  const [selectedUserGift, setSelectedUserGift] = useState<UserGift | null>(null);

  const goTo = (page: Page) => {
    setPage(page);
  };

  const goToGiftsList = useCallback(() => {
    setSelectedUserGift(null);
    goTo(Page.giftsList);
  }, []);

  const goToContactsList = useCallback(() => {
    goTo(Page.contactsList);
  }, []);

  const goToSendStatus = useCallback((eventId: string) => {
    setEventId(eventId);
    goTo(Page.sendStatus);
  }, []);

  const selectGift = useCallback(
    (userGift: UserGift) => {
      WebApp.HapticFeedback.selectionChanged();
      setSelectedUserGift(userGift);

      showPopup({
        title: t('gift.sendGift'),
        animation: getGiftAnimationBySymbol(userGift.gift.symbol),
        tableData: [
          { key: t('gift.table.gift'), value: userGift.gift.name },
          {
            key: t('gift.table.date'),
            value: new Intl.DateTimeFormat(getLanguage(), {
              dateStyle: 'long',
              timeStyle: 'short',
            }).format(new Date(userGift.boughtAt)),
          },
          {
            key: t('gift.table.price'),
            value: (
              <p className="flex items-center gap-2">
                <Image
                  width={20}
                  height={20}
                  src={assetIcon[userGift.gift.asset]}
                  alt={userGift.gift.asset}
                />
                <span>
                  {userGift.gift.price} {userGift.gift.asset}
                </span>
              </p>
            ),
          },
          {
            key: t('gift.table.availability'),
            value: t('gift.available', {
              amount: userGift.gift.availableAmount,
              total: userGift.gift.totalAmount,
            }),
          },
        ],
        buttonText: t('gift.sendToContact'),
        onClick: goToContactsList,
      });
    },
    [showPopup, t, goToContactsList],
  );

  return (
    <AnimatePresence>
      {page === Page.giftsList && (
        <motion.div {...pageAnimation} className="h-full">
          <GiftsListPage userGifts={userGifts} goNext={selectGift} isLoading={isLoadingGifts} />
        </motion.div>
      )}
      {page === Page.contactsList && selectedUserGift && (
        <motion.div {...pageAnimation} className="h-full">
          <ContactsListPage
            selectedGift={selectedUserGift}
            goBack={goToGiftsList}
            goNext={goToSendStatus}
          />
        </motion.div>
      )}
      {page === Page.sendStatus && (
        <motion.div {...pageAnimation} className="h-full">
          <SendStatusPage event={event} isLoading={isLoadingEvent} goBack={goToGiftsList} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
