'use client';

import React, { PropsWithChildren, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import { useValidateInitDataQuery } from '@/queries/useBotQuery';
import AppLoader from '@/components/app/AppLoader';
import { initLanguage } from '@/modules/i18n/client';
import { initColorTheme } from '@/modules/theme/client';
import AppError from '@/components/app/AppError';
import { useTranslation } from 'react-i18next';

WebApp.expand();
WebApp.ready();
WebApp.disableVerticalSwipes();

export default function WebAppWrapper({ children }: PropsWithChildren) {
  const { data: isValidHash, isLoading, isError } = useValidateInitDataQuery();
  const { t } = useTranslation();

  useEffect(() => {
    initColorTheme();
    initLanguage();
  }, []);

  if (isError) {
    return <AppError>{t('webAppHashValidation.noData')}</AppError>;
  }

  if (isLoading) {
    return <AppLoader />;
  }

  if (!isValidHash) {
    return <AppError>{t('webAppHashValidation.fail')}</AppError>;
  }

  return children;
}
