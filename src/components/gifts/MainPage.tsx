'use client';

import React, { useCallback, useState } from 'react';
import { useBoughtGiftsByUserIdQuery, useEventByIdQuery } from '@/queries/useEventQuery';
import { useCurrentUserQuery } from '@/queries/useUserQuery';
import { UserGift } from '@/modules/event/types';
import GiftsListPage from '@/components/gifts/GiftsListPage';
import ContactsListPage from '@/components/gifts/ContactsListPage';
import SendStatusPage from '@/components/gifts/SendStatusPage';
import { assetIcon, getGiftAnimationBySymbol } from '@/components/utils';
import usePopup from '@/hooks/usePopup';

enum Page {
  giftsList,
  contactsList,
  sendStatus,
}

export default function MainPage() {
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
      setSelectedUserGift(userGift);

      showPopup({
        title: 'Send Gift',
        animation: getGiftAnimationBySymbol(userGift.gift.symbol),
        tableData: [
          { key: 'Gift', value: userGift.gift.name },
          {
            key: 'Date',
            value: new Intl.DateTimeFormat('en', {
              dateStyle: 'long',
              timeStyle: 'short',
            }).format(new Date(userGift.boughtAt)),
          },
          {
            key: 'Price',
            value: (
              <p className="flex items-center gap-2">
                <img
                  className="h-5 w-5"
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
            key: 'Availability',
            value: `${userGift.gift.availableAmount} of ${userGift.gift.totalAmount}`,
          },
        ],
        buttonText: 'Send Gift to Contact',
        onClick: goToContactsList,
      });
    },
    [showPopup, goToContactsList],
  );

  return (
    <>
      {page === Page.giftsList && (
        <GiftsListPage userGifts={userGifts} goNext={selectGift} isLoading={isLoadingGifts} />
      )}
      {page === Page.contactsList && selectedUserGift && (
        <ContactsListPage
          selectedGift={selectedUserGift}
          goBack={goToGiftsList}
          goNext={goToSendStatus}
        />
      )}
      {page === Page.sendStatus && (
        <SendStatusPage event={event} isLoading={isLoadingEvent} goBack={goToGiftsList} />
      )}
    </>
  );
}
