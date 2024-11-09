'use client';

import React, { useCallback, useState } from 'react';
import LeaderboardPage from '@/components/leaderboard/LeaderboardPage';
import { LeaderboardProfile } from '@/modules/user/types';
import { useCurrentUserQuery, useLeaderboardUsersQuery } from '@/queries/useUserQuery';
import LeaderboardProfilePage from '@/components/leaderboard/LeaderboardProfilePage';

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
    <>
      {page === Page.leaderboard && (
        <LeaderboardPage
          goNext={goToProfile}
          leaderboard={leaderboard}
          isLoadingLeaderboard={isLoadingLeaderboard}
        />
      )}
      {page === Page.profile && (
        <LeaderboardProfilePage goBack={goToLeaderboard} profile={selectedProfile} />
      )}
    </>
  );
}
