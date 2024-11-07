'use client';

import React, { useState } from 'react';
import { useBoughtGiftsByUserIdQuery } from '@/queries/useEventQuery';
import { useCurrentUserQuery } from '@/queries/useUserQuery';
import { UserGift } from '@/modules/event/types';
import GiftsListPage from '@/components/gifts/GiftsListPage';
import GiftItemPage from '@/components/gifts/GiftItemPage';
import ContactsListPage from '@/components/gifts/ContactsListPage';
import SendStatusPage from '@/components/gifts/SendStatusPage';

enum Page {
  giftsList,
  giftItem,
  contactsList,
  sendStatus,
}

export default function MainPage() {
  const { data: user } = useCurrentUserQuery();
  const { data: userGifts } = useBoughtGiftsByUserIdQuery(user?.id || '');
  const [page, setPage] = useState(Page.giftsList);
  const [selectedUserGift, setSelectedUserGift] = useState<UserGift | null>(null);

  const goTo = (page: Page) => {
    setPage(page);
  };

  const goToGiftsList = () => {
    setSelectedUserGift(null);
    goTo(Page.giftsList);
  };

  return (
    <>
      {page === Page.giftsList && Array.isArray(userGifts) && (
        <GiftsListPage
          userGifts={userGifts}
          selectUserGift={(userGift) => {
            setSelectedUserGift(userGift);
            goTo(Page.giftItem);
          }}
        />
      )}
      {page === Page.giftItem && selectedUserGift && (
        <GiftItemPage
          selectedGift={selectedUserGift}
          goNext={() => goTo(Page.contactsList)}
          goBack={() => goToGiftsList()}
        />
      )}
      {page === Page.contactsList && selectedUserGift && (
        <ContactsListPage
          selectedGift={selectedUserGift}
          goBack={() => goTo(Page.giftItem)}
          goNext={() => goTo(Page.sendStatus)}
        />
      )}
      {page === Page.sendStatus && selectedUserGift && (
        <SendStatusPage
          selectedGift={selectedUserGift}
          goBack={() => goTo(Page.giftItem)}
          goNext={() => goToGiftsList()}
        />
      )}
    </>
  );
}
