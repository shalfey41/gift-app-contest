'use client';

import React, { useContext, useEffect, useRef } from 'react';
import { useReceiveGiftByEventIdQuery } from '@/queries/useEventQuery';
import { useCurrentUserQuery } from '@/queries/useUserQuery';
import ReceiveStatusPage from '@/components/receiveGift/ReceiveStatusPage';
import { PageContext } from '@/components/app/PageContext';

export default function MainPage() {
  const { route, setRoute } = useContext(PageContext);
  const eventId = useRef(route.params?.eventId);
  const { data: user } = useCurrentUserQuery();
  const { data, isPending: isLoadingEvent } = useReceiveGiftByEventIdQuery(
    eventId.current || '',
    user?.id || '',
  );
  let event;
  let error;

  if (data && 'code' in data) {
    error = data.code;
  } else if (data) {
    event = data;
  }

  useEffect(() => {
    if (route.params?.eventId) {
      setRoute({ page: route.page });
    }
  }, []);

  return <ReceiveStatusPage event={event} error={error} isLoading={isLoadingEvent} />;
}
