'use client';

import React, { useCallback, useState } from 'react';
import LeaderboardPage from '@/components/leaderboard/LeaderboardPage';
import { LeaderboardProfile } from '@/modules/user/types';
import { useCurrentUserQuery, useLeaderboardUsersQuery } from '@/queries/useUserQuery';
import LeaderboardProfilePage from '@/components/leaderboard/LeaderboardProfilePage';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';

enum Page {
  leaderboard,
  profile,
}

export default function MainPage() {
  const [page, setPage] = useState(Page.leaderboard);
  const [selectedProfile, setSelectedProfile] = useState<LeaderboardProfile | null>(null);
  const { data: user } = useCurrentUserQuery();
  const { data: leaderboard, isPending: isLoadingLeaderboard } = useLeaderboardUsersQuery(user?.id);

  const goTo = (page: Page) => {
    setPage(page);
  };

  const goToLeaderboard = useCallback(() => {
    setSelectedProfile(null);
    goTo(Page.leaderboard);
  }, []);

  const goToProfile = useCallback((profile: LeaderboardProfile) => {
    setSelectedProfile(profile);
    goTo(Page.profile);
  }, []);

  return (
    <LayoutGroup>
      <AnimatePresence mode="popLayout">
        {page === Page.leaderboard && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, filter: 'blur(2px)' }}
            transition={{ type: 'spring', stiffness: 170, damping: 20 }}
          >
            <LeaderboardPage
              key={Page.leaderboard}
              goNext={goToProfile}
              leaderboard={leaderboard}
              isLoadingLeaderboard={isLoadingLeaderboard}
            />
          </motion.div>
        )}
        {page === Page.profile && (
          <motion.div
            key={Page.profile}
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(2px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0)' }}
            exit={{ opacity: 0, scale: 0.8, filter: 'blur(2px)' }}
            transition={{
              type: 'spring',
              stiffness: 120,
              damping: 20,
            }}
          >
            <LeaderboardProfilePage goBack={goToLeaderboard} profile={selectedProfile} />
          </motion.div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}
