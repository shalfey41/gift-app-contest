'use client';

import React, { useCallback, useState } from 'react';
import { Gift } from '@prisma/client';
import StorePage from '@/components/store/StorePage';
import GiftPage from '@/components/store/GiftPage';
import PurchaseStatusPage from '@/components/store/PurchaseStatusPage';
import { useGiftsQuery } from '@/queries/useGiftQuery';
import { AnimatePresence, motion } from 'framer-motion';
import { pageAnimation } from '@/components/utils';

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
    <AnimatePresence mode="wait">
      {page === Page.store && (
        <motion.div
          key={Page.store}
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0)' }}
        >
          <StorePage isLoading={isLoadingGifts} gifts={gifts || []} selectGift={selectGift} />
        </motion.div>
      )}
      {page === Page.gift && selectedGift && (
        <motion.div
          key={Page.gift}
          initial={{ y: 50, opacity: 0, filter: 'blur(4px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0)' }}
          exit={{ y: 50, opacity: 0, filter: 'blur(4px)' }}
        >
          <GiftPage gift={selectedGift} goNext={goToPurchaseStatus} goBack={goToStore} />
        </motion.div>
      )}
      {page === Page.purchaseStatus && selectedGift && (
        <motion.div key={Page.purchaseStatus} {...pageAnimation} className="h-full">
          <PurchaseStatusPage gift={selectedGift} goBack={goToStore} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
