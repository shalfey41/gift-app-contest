'use client';

import React, { useState } from 'react';
import StorePage from '@/components/store/MainPage';
import GiftsPage from '@/components/gifts/MainPage';
import LeaderboardPage from '@/components/leaderboard/MainPage';
import ProfilePage from '@/components/profile/MainPage';
import { Page, PageContext, ToastOptions } from '@/components/app/PageContext';
import MenuBar from '@/components/app/menu/MenuBar';
import BottomBar from '@/components/app/BottomBar';
import { useTraceUpdate } from '@/hooks/useTraceUpdate';
import Toast from '@/components/ui/Toast';

export default function App() {
  // todo start param check
  const [page, setPage] = useState(Page.store);
  const [showBottomBar, toggleBottomBar] = useState(true);
  const [bottomBar, setBottomBar] = useState<React.ReactNode>(<MenuBar />);
  const [toast, setToast] = useState<ToastOptions | null>(null);

  useTraceUpdate('App', { page, showBottomBar, bottomBar });

  return (
    <PageContext.Provider value={{ page, setPage, toggleBottomBar, setBottomBar, setToast }}>
      {/*<div className="grow bg-background">*/}
      <div className="grow overflow-y-scroll bg-background">
        {/*<div className="bg-background">*/}
        {page === Page.store && <StorePage />}
        {page === Page.gifts && <GiftsPage />}
        {page === Page.leaderboard && <LeaderboardPage />}
        {page === Page.profile && <ProfilePage />}

        {/*<div className="sticky bottom-0 w-full">*/}
        {/*  <BottomBar>{bottomBar}</BottomBar>*/}
        {/*</div>*/}
      </div>

      {/*<div className="sticky bottom-0 shrink-0">*/}
      {/*  /!*<div className="sticky bottom-0 w-full">*!/*/}
      {/*  <BottomBar>{bottomBar}</BottomBar>*/}
      {/*</div>*/}

      <div className="shrink-0">
        {toast && (
          <div className="absolute top-0 z-10 w-full -translate-y-full p-4">
            <Toast
              iconSrc={toast.iconSrc}
              title={toast.title}
              text={toast.text}
              buttonText={toast.buttonText}
              onClick={toast.onClick}
            />
          </div>
        )}
        {showBottomBar && <BottomBar>{bottomBar}</BottomBar>}
      </div>
    </PageContext.Provider>
  );
}
