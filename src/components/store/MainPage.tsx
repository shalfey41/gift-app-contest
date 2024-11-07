'use client';

import React, { useCallback, useState } from 'react';
import { Gift } from '@prisma/client';
import StorePage from '@/components/store/StorePage';
import GiftPage from '@/components/store/GiftPage';
import PurchaseStatusPage from '@/components/store/PurchaseStatusPage';
import { useGiftsQuery } from '@/queries/useGiftQuery';

enum Page {
  store,
  gift,
  purchaseStatus,
}

export default function MainPage() {
  const [page, setPage] = useState(Page.store);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const { data: gifts, isLoading: isLoadingGifts } = useGiftsQuery();

  const goTo = (page: Page) => {
    setPage(page);
  };

  const goToStore = useCallback(() => {
    goTo(Page.store);
    setSelectedGift(null);
  }, []);

  const goToGift = useCallback(() => {
    goTo(Page.gift);
  }, []);

  const goToPurchaseStatus = useCallback(() => {
    goTo(Page.purchaseStatus);
  }, []);

  const selectGift = useCallback(
    (gift: Gift) => {
      setSelectedGift(gift);
      goToGift();
    },
    [goToGift],
  );

  return (
    <>
      {page === Page.store && (
        <StorePage isLoading={isLoadingGifts} gifts={gifts || []} selectGift={selectGift} />
      )}
      {page === Page.gift && selectedGift && (
        <GiftPage gift={selectedGift} goNext={goToPurchaseStatus} goBack={goToStore} />
      )}
      {page === Page.purchaseStatus && selectedGift && (
        <PurchaseStatusPage gift={selectedGift} goBack={goToStore} />
      )}
    </>
  );
}
