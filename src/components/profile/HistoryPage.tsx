import React, { useContext, useEffect, useMemo } from 'react';
import { PageContext } from '@/components/app/PageContext';
import Loader from '@/components/ui/Loader';
import { BackButton } from '@twa-dev/sdk/react';
import { useAllEventsByUserIdQuery } from '@/queries/useEventQuery';
import HistoryEventRow from '@/components/profile/HistoryEventRow';
import HistoryEmpty from '@/components/profile/HistoryEmpty';
import { groupEventsByDay } from '@/components/profile/utils';
import { useTranslation } from 'react-i18next';

type Props = {
  userId: string;
  goBack: () => void;
};

export default function HistoryPage({ userId, goBack }: Props) {
  const { t } = useTranslation();
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

  if (isLoading) {
    return (
      <div className="mt-8 flex w-full justify-center">
        <Loader />
      </div>
    );
  }

  if (isEmptyList) {
    return (
      <>
        <HistoryEmpty />
        <BackButton onClick={() => goBack()} />
      </>
    );
  }

  return (
    <>
      <section className="px-4">
        <div className="mb-7 mt-6 grid justify-items-center gap-2 text-balance text-center">
          <h1 className="text-lg font-semibold">{t('history.title')}</h1>
          <p className="text-label-secondary">{t('history.text')}</p>
        </div>
      </section>

      <div className="mb-8">
        {eventsByDay?.dates.map((date) => (
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
        ))}
      </div>

      <BackButton onClick={() => goBack()} />
    </>
  );
}
