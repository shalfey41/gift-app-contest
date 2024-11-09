import React, { useCallback, useContext } from 'react';
import { Page, PageContext } from '@/components/app/PageContext';
import Loader from '@/components/ui/Loader';
import { useReceivedGiftsByUserIdQuery } from '@/queries/useEventQuery';
import ListEmpty from '@/components/ui/ListEmpty';
import ReceivedGiftCard from '@/components/ui/ReceivedGiftCard';
import usePopup from '@/hooks/usePopup';
import { assetIcon, getGiftAnimationBySymbol } from '@/components/utils';
import { Prisma } from '@prisma/client';
import EventGetPayload = Prisma.EventGetPayload;
import EventInclude = Prisma.EventInclude;

type Props = {
  userId: string;
};

export default function UserEvents({ userId }: Props) {
  const { setPage } = useContext(PageContext);
  const { showPopup, closePopup } = usePopup();
  const { data: events, isPending: isLoadingEvents } = useReceivedGiftsByUserIdQuery(userId);

  const selectGift = useCallback(
    (event: EventGetPayload<{ include: EventInclude }>) => {
      showPopup({
        title: event.gift.name,
        animation: getGiftAnimationBySymbol(event.gift.symbol),
        tableData: [
          {
            key: 'From',
            value: (
              <p className="flex items-center gap-2">
                {event.remitter && (
                  <img
                    className="h-5 w-5 rounded-full"
                    src={event.remitter.avatarUrl}
                    alt={event.remitter.name || 'User avatar'}
                  />
                )}
                <span>{event.remitter?.name || 'Anonymous'}</span>
              </p>
            ),
          },
          {
            key: 'Date',
            value: new Intl.DateTimeFormat('en', {
              dateStyle: 'long',
              timeStyle: 'short',
            }).format(new Date(event.createdAt)),
          },
          {
            key: 'Price',
            value: (
              <p className="flex items-center gap-2">
                <img className="h-5 w-5" src={assetIcon[event.gift.asset]} alt={event.gift.asset} />
                <span>
                  {event.gift.price} {event.gift.asset}
                </span>
              </p>
            ),
          },
          {
            key: 'Availability',
            value: `${event.gift.availableAmount} of ${event.gift.totalAmount}`,
          },
        ],
        buttonText: 'Close',
        onClick: closePopup,
      });
    },
    [closePopup, showPopup],
  );

  if (isLoadingEvents) {
    return (
      <div className="mt-5 flex w-full justify-center">
        <Loader />
      </div>
    );
  }

  if (!events || !events?.total) {
    return (
      <ListEmpty
        title="You can buy a gift to receive a gift in return."
        onClick={() => setPage(Page.store)}
      />
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {events.list.map((event) => (
        <ReceivedGiftCard
          key={event.id}
          user={event.remitter}
          gift={event.gift}
          selectGift={() => selectGift(event)}
        />
      ))}
    </div>
  );
}
