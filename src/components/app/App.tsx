'use client';

import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import StorePage from '@/components/store/MainPage';
import GiftsPage from '@/components/gifts/MainPage';
import LeaderboardPage from '@/components/leaderboard/MainPage';
import ProfilePage from '@/components/profile/MainPage';
import ReceiveGiftPage from '@/components/receiveGift/MainPage';
import { PageContext, PopupOptions, ToastOptions } from '@/components/app/PageContext';
import MenuBar from '@/components/ui/menu/MenuBar';
import BottomBar from '@/components/ui/BottomBar';
import { useTraceUpdate } from '@/hooks/useTraceUpdate';
import Toast from '@/components/ui/Toast';
import Popup from '@/components/ui/Popup';
import WebApp from '@twa-dev/sdk';
import { parseStartParam } from '@/components/utils';
import { Page } from '@/modules/types';

export default function App() {
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const [bottomBarHeight, setBottomBarHeight] = useState(0);
  const [route, setRoute] = useState(parseStartParam(WebApp.initDataUnsafe.start_param));
  const [showBottomBar, toggleBottomBar] = useState(true);
  const [bottomBar, setBottomBar] = useState<React.ReactNode>(<MenuBar />);
  const [toast, setToast] = useState<ToastOptions | null>(null);
  const [popup, setPopup] = useState<PopupOptions | null>(null);

  useTraceUpdate('App', { route, showBottomBar, bottomBar, toast, popup, bottomBarHeight });

  useEffect(() => {
    if (bottomBarRef.current) {
      setBottomBarHeight(bottomBarRef.current.clientHeight);
    }
  }, [toast, bottomBar, showBottomBar]);

  useEffect(() => {
    if (popup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [popup]);

  return (
    <PageContext.Provider
      value={{
        route,
        popup,
        bottomBarHeight,
        toggleBottomBar,
        setBottomBar,
        setToast,
        setPopup,
        setRoute,
      }}
    >
      <div
        className={classNames('relative grow bg-background')}
        style={{ paddingBottom: bottomBarHeight }}
      >
        {route.page === Page.store && <StorePage />}
        {route.page === Page.gifts && <GiftsPage />}
        {route.page === Page.leaderboard && <LeaderboardPage />}
        {route.page === Page.profile && <ProfilePage />}
        {route.page === Page.receiveGift && <ReceiveGiftPage />}

        {popup && <div className="absolute inset-0 z-20 bg-black/30" />}
      </div>

      <div className="fixed bottom-0 z-30 w-full bg-tab-bar" ref={bottomBarRef}>
        {popup && (
          <div className="absolute top-full w-full -translate-y-full">
            <Popup />
          </div>
        )}
        {toast && (
          <div className="absolute top-0 w-full -translate-y-full p-4 pb-8">
            <Toast
              iconSrc={toast.iconSrc}
              title={toast.title}
              text={toast.text}
              buttonText={toast.buttonText}
              onClick={toast.onClick}
            />
          </div>
        )}
        {showBottomBar && (
          <div className="relative pb-4">
            <BottomBar>{bottomBar}</BottomBar>
          </div>
        )}
      </div>
    </PageContext.Provider>
  );
}
