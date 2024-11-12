'use client';

import React, { useCallback, useState } from 'react';
import { Gift } from '@prisma/client';
import StorePage from '@/components/store/StorePage';
import GiftPage from '@/components/store/GiftPage';
import PurchaseStatusPage from '@/components/store/PurchaseStatusPage';
import { useGiftsQuery } from '@/queries/useGiftQuery';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
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
    <LayoutGroup>
      <AnimatePresence mode="popLayout" initial={false}>
        {page === Page.store && (
          <motion.div
            key={Page.store}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7, filter: 'blur(2px)' }}
            transition={{ type: 'spring', stiffness: 170, damping: 20 }}
            className="h-full"
          >
            <StorePage isLoading={isLoadingGifts} gifts={gifts || []} selectGift={selectGift} />
          </motion.div>
        )}
        {page === Page.gift && selectedGift && (
          <motion.div
            key={Page.gift}
            initial={{ y: 100, opacity: 0, filter: 'blur(2px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0)' }}
            exit={{ opacity: 0, filter: 'blur(2px)' }}
            transition={{
              type: 'spring',
              stiffness: 120,
              damping: 20,
            }}
            className="h-full"
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
    </LayoutGroup>
  );
}
