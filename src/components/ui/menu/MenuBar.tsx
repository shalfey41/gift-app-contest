import React, { useContext } from 'react';
import { Page, PageContext } from '@/components/app/PageContext';
import tabStoreAnimation from '@/lottie/tab-store.json';
import tabGiftsAnimation from '@/lottie/tab-gifts.json';
import tabLeaderboardAnimation from '@/lottie/tab-leaderboard.json';
import tabProfileAnimation from '@/lottie/tab-profile.json';
import MenuItem from '@/components/ui/menu/MenuItem';

const pages = [
  { page: Page.store, label: 'Store', animation: tabStoreAnimation },
  { page: Page.gifts, label: 'Gifts', animation: tabGiftsAnimation },
  { page: Page.leaderboard, label: 'Leaderboard', animation: tabLeaderboardAnimation },
  { page: Page.profile, label: 'Profile', animation: tabProfileAnimation },
];

export default function MenuBar() {
  const { page: currentPage, setPage } = useContext(PageContext);

  return (
    <div className="grid grid-cols-4 gap-2 pt-2">
      {pages.map(({ page, label, animation }) => (
        <MenuItem
          key={page}
          animation={animation}
          label={label}
          isActive={page === currentPage}
          onClick={() => setPage(page)}
        />
      ))}
    </div>
  );
}
