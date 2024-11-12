import React, { useContext, useEffect, useMemo } from 'react';
import { useDebounce } from 'use-debounce';
import { useCurrentUserQuery, useSearchLeaderboardUsersQuery } from '@/queries/useUserQuery';
import { PageContext } from '@/components/app/PageContext';
import SearchInput from '@/components/ui/SearchInput';
import { Leaderboard, LeaderboardProfile } from '@/modules/user/types';
import MenuBar from '@/components/ui/menu/MenuBar';
import Loader from '@/components/ui/Loader';
import { useTranslation } from 'react-i18next';
import LeaderboardList from '@/components/leaderboard/LeaderboardList';

type Props = {
  leaderboard?: Leaderboard | null;
  isLoadingLeaderboard: boolean;
  goNext: (profile: LeaderboardProfile) => void;
};

export default function LeaderboardPage({ goNext, leaderboard, isLoadingLeaderboard }: Props) {
  const { t } = useTranslation();
  const { setBottomBar, bottomBarHeight } = useContext(PageContext);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const { data: user } = useCurrentUserQuery();
  const { data: searchResult, isLoading: isLoadingSearchResult } =
    useSearchLeaderboardUsersQuery(debouncedSearchQuery);

  const isSearchMode = searchQuery.length > 0;
  const currentLeaderboard = useMemo(
    () => (isSearchMode ? searchResult || [] : leaderboard?.list || []),
    [isSearchMode, leaderboard, searchResult],
  );
  const currentLoading = isSearchMode ? isLoadingSearchResult : isLoadingLeaderboard;
  const hasCurrentUser = useMemo(
    () => (!isSearchMode ? currentLeaderboard.some((profile) => profile.id === user?.id) : false),
    [currentLeaderboard, isSearchMode, user],
  );
  const showMyRow = Boolean(!hasCurrentUser && leaderboard?.me && !searchQuery.length);

  useEffect(() => {
    setBottomBar(<MenuBar />);
  }, [setBottomBar]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div
      className="overflow-y-auto bg-background"
      style={{ paddingBottom: bottomBarHeight, height: '100dvh' }}
    >
      <SearchInput value={searchQuery} onChange={setSearchQuery} variant="background" />
      <div className="mb-6">
        {(() => {
          if (currentLoading) {
            return (
              <div className="mt-8 flex w-full justify-center">
                <Loader />
              </div>
            );
          }

          if (currentLeaderboard?.length === 0 && !searchQuery.length) {
            return (
              <p className="mt-8 flex w-full justify-center font-medium">
                {t('leaderboard.empty')}
              </p>
            );
          }

          return (
            leaderboard?.me && (
              <LeaderboardList
                leaderboard={currentLeaderboard}
                me={leaderboard.me}
                goNext={goNext}
                showMyRow={showMyRow}
              />
            )
          );
        })()}
      </div>
    </div>
  );
}
