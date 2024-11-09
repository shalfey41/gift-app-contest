import React, { useContext, useEffect, useMemo } from 'react';
import { PageContext } from '@/components/app/PageContext';
import Loader from '@/components/ui/Loader';
import { BackButton } from '@twa-dev/sdk/react';
import { useAllEventsByUserIdQuery } from '@/queries/useEventQuery';
import HistoryEventRow from '@/components/profile/HistoryEventRow';
import HistoryEmpty from '@/components/profile/HistoryEmpty';
import { groupEventsByDay } from '@/components/profile/utils';

type Props = {
  userId: string;
  goBack: () => void;
};

export default function HistoryPage({ userId, goBack }: Props) {
  const { toggleBottomBar } = useContext(PageContext);
  const { data, isLoading } = useAllEventsByUserIdQuery(userId);
  const eventsByDay = useMemo(() => groupEventsByDay(data?.list || []), [data]);
  const isEmptyList = !isLoading && (!data || !data.total);

  useEffect(() => {
    toggleBottomBar(isEmptyList);

    return () => {
      toggleBottomBar(true);
    };
  }, [toggleBottomBar, isEmptyList]);

  if (isEmptyList) {
    return <HistoryEmpty />;
  }

  return (
    <>
      <section className="px-4">
        <div className="mb-7 mt-6 grid justify-items-center gap-2 text-balance text-center">
          <h1 className="text-lg font-semibold">Recent Actions</h1>
          <p className="text-label-secondary">Here is your action history.</p>
        </div>
      </section>

      <div className="mb-8">
        {(() => {
          if (isLoading) {
            return (
              <div className="flex w-full justify-center">
                <Loader />
              </div>
            );
          }

          return eventsByDay?.dates.map((date) => (
            <div key={date}>
              <p className="px-4 pb-3 pt-6 text-xs uppercase text-label-date">{date}</p>
              {eventsByDay.eventsByDate[date].map((event, index) => (
                <HistoryEventRow
                  event={event}
                  key={event.id}
                  separator={index !== eventsByDay.eventsByDate[date].length - 1}
                />
              ))}
            </div>
          ));
        })()}
      </div>

      <BackButton onClick={() => goBack()} />
    </>
  );
}
