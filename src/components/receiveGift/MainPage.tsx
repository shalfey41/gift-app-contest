'use client';

import React, { useContext, useEffect, useRef } from 'react';
import { useReceiveGiftByEventIdQuery } from '@/queries/useEventQuery';
import { useCurrentUserQuery } from '@/queries/useUserQuery';
import ReceiveStatusPage from '@/components/receiveGift/ReceiveStatusPage';
import { ErrorCode } from '@/modules/types';
import { PageContext } from '@/components/app/PageContext';
import { logError } from '@/modules/event/service';

export default function MainPage() {
  const { route, setRoute } = useContext(PageContext);
  const eventId = useRef(route.params?.eventId);
  const { data: user } = useCurrentUserQuery();
  const {
    data: event,
    isPending: isLoadingEvent,
    error,
  } = useReceiveGiftByEventIdQuery(eventId.current || '', user?.id || '');

  useEffect(() => {
    if (route.params?.eventId) {
      setRoute({ page: route.page });
    }
  }, []);

  useEffect(() => {
    if (error) {
      logError(error, error.message);
    }
  }, [error]);

  return (
    <ReceiveStatusPage
      event={event}
      error={error?.message as ErrorCode}
      isLoading={isLoadingEvent}
    />
  );
}
