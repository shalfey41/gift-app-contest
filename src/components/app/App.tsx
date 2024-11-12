'use client';

import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import WebApp from '@twa-dev/sdk';
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
import { pageAnimation, parseStartParam } from '@/components/utils';
import { Page } from '@/modules/types';
import { AnimatePresence, motion } from 'framer-motion';

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
        <AnimatePresence mode="wait">
          {route.page === Page.store && (
            <motion.div key={Page.store} {...pageAnimation} className="h-full">
              <StorePage />
            </motion.div>
          )}
          {route.page === Page.gifts && (
            <motion.div key={Page.gifts} {...pageAnimation} className="h-full">
              <GiftsPage />
            </motion.div>
          )}
          {route.page === Page.leaderboard && (
            <motion.div key={Page.leaderboard} {...pageAnimation} className="h-full">
              <LeaderboardPage />
            </motion.div>
          )}
          {route.page === Page.profile && (
            <motion.div key={Page.profile} {...pageAnimation} className="h-full">
              <ProfilePage />
            </motion.div>
          )}
          {route.page === Page.receiveGift && (
            <motion.div key={Page.receiveGift} {...pageAnimation} className="h-full">
              <ReceiveGiftPage />
            </motion.div>
          )}
        </AnimatePresence>

        {popup && (
          <motion.div
            key="overlay"
            className="absolute inset-0 z-20 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </div>

      <motion.div
        layout="position"
        className="fixed bottom-0 z-30 w-full bg-tab-bar"
        ref={bottomBarRef}
      >
        <AnimatePresence>
          {popup && (
            <motion.div
              key="popup"
              className="absolute top-full z-10 w-full"
              initial={{ y: 0 }}
              animate={{ y: '-100%' }}
              exit={{ y: 0 }}
              transition={{ ease: 'anticipate' }}
            >
              <Popup />
            </motion.div>
          )}
          {toast && (
            <motion.div
              key="toast"
              className="absolute top-0 w-full p-4"
              initial={{ y: 0 }}
              animate={{ y: '-100%' }}
              exit={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
            >
              <Toast
                iconSrc={toast.iconSrc}
                title={toast.title}
                text={toast.text}
                buttonText={toast.buttonText}
                onClick={toast.onClick}
              />
            </motion.div>
          )}
          {showBottomBar && (
            <motion.div
              layout
              key="showBottomBar"
              className="relative pb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <BottomBar>{bottomBar}</BottomBar>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </PageContext.Provider>
  );
}
