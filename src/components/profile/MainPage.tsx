'use client';

import React, { useCallback, useState } from 'react';
import { useCurrentUserQuery, useLeaderboardProfileQuery } from '@/queries/useUserQuery';
import UserProfilePage from '@/components/profile/UserProfilePage';
import HistoryPage from '@/components/profile/HistoryPage';
import { AnimatePresence, motion } from 'framer-motion';
import { pageAnimation } from '@/components/utils';

enum Page {
  profile,
  history,
}

export default function MainPage() {
  const [page, setPage] = useState(Page.profile);
  const { data: user } = useCurrentUserQuery();
  const { data: profile, isPending } = useLeaderboardProfileQuery(user?.id);

  const goTo = (page: Page) => {
    setPage(page);
  };

  const goToHistory = useCallback(() => {
    goTo(Page.history);
  }, []);

  const goToProfile = useCallback(() => {
    goTo(Page.profile);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {page === Page.profile && (
        <motion.div key={Page.profile} {...pageAnimation}>
          <UserProfilePage profile={profile} isLoading={isPending} goNext={goToHistory} />
        </motion.div>
      )}

      {page === Page.history && user && (
        <motion.div key={Page.history} {...pageAnimation}>
          <HistoryPage userId={user.id} goBack={goToProfile} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
