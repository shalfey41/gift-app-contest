'use client';

import React, { useState } from 'react';
import { useReceiveGiftByEventIdQuery } from '@/queries/useEventQuery';
import { useCurrentUserQuery } from '@/queries/useUserQuery';
import ReceiveStatusPage from '@/components/receiveGift/ReceiveStatusPage';
import { ErrorCode } from '@/modules/types';

export default function MainPage() {
  // todo get eventId from start param
  const [eventId, setEventId] = useState<string | null>(null);
  const { data: user } = useCurrentUserQuery();
  const {
    data: event,
    isPending: isLoadingEvent,
    error,
  } = useReceiveGiftByEventIdQuery(eventId || '', user?.id || '');

  return (
    <ReceiveStatusPage
      event={event}
      error={error?.message as ErrorCode}
      isLoading={isLoadingEvent}
    />
  );
}
