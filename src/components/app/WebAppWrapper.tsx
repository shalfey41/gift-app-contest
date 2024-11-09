'use client';

import React, { PropsWithChildren, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import { useValidateInitDataQuery } from '@/queries/useBotQuery';
import AppLoader from '@/components/app/AppLoader';
import { initLanguage } from '@/modules/i18n/client';
import { initColorTheme } from '@/modules/theme/client';
import AppError from '@/components/app/AppError';

WebApp.expand();
WebApp.ready();
WebApp.disableVerticalSwipes();

export default function WebAppWrapper({ children }: PropsWithChildren) {
  const { data: isValidHash, isLoading, isError } = useValidateInitDataQuery();

  useEffect(() => {
    initColorTheme();
    initLanguage();
  }, []);

  if (isError) {
    return <AppError>You need to open the app from telegram</AppError>;
  }

  if (isLoading) {
    return <AppLoader />;
  }

  if (!isValidHash) {
    return <AppError>Hash is not valid</AppError>;
  }

  return children;
}
