'use client';

import React from 'react';
import MenuBar from '@/components/app/menu/MenuBar';
import { BottomBar } from '@twa-dev/sdk/react';

export default function MainPage() {
  // const [page, setPage] = useState(Page.giftsList);
  // const { data: leaderboardUsers } = useLeaderboardUsersQuery();
  //
  // const goTo = (page: Page) => {
  //   setPage(page);
  // };
  //
  // const goToGiftsList = () => {
  //   goTo(Page.giftsList);
  // };
  //
  // console.log(leaderboardUsers);

  return (
    <>
      <div className="grow">
        <h1>Leaderboard</h1>
      </div>

      <BottomBar>
        <MenuBar />
      </BottomBar>
    </>
  );
}
