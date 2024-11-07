'use client';

import React, { PropsWithChildren, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import { useValidateInitDataQuery } from '@/queries/useBotQuery';
import AppLoader from '@/components/app/AppLoader';
import { getCssVar } from '@/components/utils';

WebApp.expand();
WebApp.ready();

export default function WebAppWrapper({ children }: PropsWithChildren) {
  const { data: isValidHash, isLoading, isError } = useValidateInitDataQuery();

  useEffect(() => {
    // todo language and theme
    const setThemeClass = () => {
      document.documentElement.className = WebApp.colorScheme;

      if (WebApp.colorScheme === 'dark') {
        // WebApp.setBackgroundColor('#121212');
      } else {
        WebApp.setBackgroundColor(getCssVar('--color-bg-tab-bar'));
        WebApp.setBottomBarColor(getCssVar('--color-bg-tab-bar'));
      }
    };

    setThemeClass();

    WebApp.onEvent('themeChanged', setThemeClass);

    return () => {
      WebApp.offEvent('themeChanged', setThemeClass);
    };
  }, []);

  if (isError) {
    // todo error
    return <h1>You need to open the app from telegram</h1>;
  }

  if (isLoading) {
    return <AppLoader />;
  }

  if (!isValidHash) {
    // todo error
    return <h1>Hash is not valid</h1>;
  }

  return children;
}
