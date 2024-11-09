'use client';

import React, { useCallback, useState } from 'react';
import { useCurrentUserQuery, useLeaderboardProfileQuery } from '@/queries/useUserQuery';
import UserProfilePage from '@/components/profile/UserProfilePage';
import HistoryPage from '@/components/profile/HistoryPage';

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
    <>
      {page === Page.profile && (
        <UserProfilePage profile={profile} isLoading={isPending} goNext={goToHistory} />
      )}

      {page === Page.history && user && <HistoryPage userId={user.id} goBack={goToProfile} />}
    </>
  );
}
