import React, { useContext, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { useCurrentUserQuery, useSearchLeaderboardUsersQuery } from '@/queries/useUserQuery';
import { PageContext } from '@/components/app/PageContext';
import SearchInput from '@/components/ui/SearchInput';
import { Leaderboard, LeaderboardProfile } from '@/modules/user/types';
import MenuBar from '@/components/ui/menu/MenuBar';
import Loader from '@/components/ui/Loader';
import LeaderboardUserRow from '@/components/leaderboard/LeaderboardUserRow';

type Props = {
  leaderboard?: Leaderboard | null;
  isLoadingLeaderboard: boolean;
  goNext: (profile: LeaderboardProfile) => void;
};

export default function LeaderboardPage({ goNext, leaderboard, isLoadingLeaderboard }: Props) {
  const { setBottomBar } = useContext(PageContext);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const { data: user } = useCurrentUserQuery();
  const { data: searchResult, isLoading: isLoadingSearchResult } =
    useSearchLeaderboardUsersQuery(debouncedSearchQuery);

  const isSearchMode = searchQuery.length > 0;
  const currentLeaderboard = isSearchMode ? searchResult || [] : leaderboard?.list || [];
  const currentLoading = isSearchMode ? isLoadingSearchResult : isLoadingLeaderboard;
  const hasCurrentUser = !isSearchMode
    ? currentLeaderboard.some((profile) => profile.id === user?.id)
    : false;
  const showMyRow = Boolean(!hasCurrentUser && leaderboard?.me);

  useEffect(() => {
    setBottomBar(<MenuBar />);
  }, [setBottomBar]);

  return (
    <>
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

          if (currentLeaderboard?.length === 0) {
            return <p className="mt-8 flex w-full justify-center font-medium">No results</p>;
          }

          return (
            <>
              {currentLeaderboard.map((profile, index) => (
                <LeaderboardUserRow
                  key={profile.id}
                  profile={profile}
                  isCurrentUser={profile.id === user?.id}
                  separator={index !== currentLeaderboard.length - 1 && !showMyRow}
                  onClick={() => goNext(profile)}
                />
              ))}
              {showMyRow && leaderboard && (
                <LeaderboardUserRow
                  profile={leaderboard.me}
                  isCurrentUser
                  separator={false}
                  onClick={() => goNext(leaderboard.me)}
                />
              )}
            </>
          );
        })()}
      </div>
    </>
  );
}
