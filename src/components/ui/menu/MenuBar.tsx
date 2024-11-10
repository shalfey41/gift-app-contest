import React, { useContext } from 'react';
import { PageContext } from '@/components/app/PageContext';
import tabStoreAnimation from '@/lottie/tab-store.json';
import tabGiftsAnimation from '@/lottie/tab-gifts.json';
import tabLeaderboardAnimation from '@/lottie/tab-leaderboard.json';
import tabProfileAnimation from '@/lottie/tab-profile.json';
import MenuItem from '@/components/ui/menu/MenuItem';
import { Page } from '@/modules/types';
import { useTranslation } from 'react-i18next';

const pages = [
  { page: Page.store, label: 'menu.store', animation: tabStoreAnimation },
  { page: Page.gifts, label: 'menu.gifts', animation: tabGiftsAnimation },
  { page: Page.leaderboard, label: 'menu.leaderboard', animation: tabLeaderboardAnimation },
  { page: Page.profile, label: 'menu.profile', animation: tabProfileAnimation },
];

export default function MenuBar() {
  const { t } = useTranslation();
  const { route, setRoute } = useContext(PageContext);

  return (
    <div className="grid grid-cols-4 gap-2 pt-2">
      {pages.map(({ page, label, animation }) => (
        <MenuItem
          key={page}
          animation={animation}
          label={t(label)}
          isActive={page === route.page}
          onClick={() => setRoute({ page })}
        />
      ))}
    </div>
  );
}
